#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script to update the changelog with recent changes
 * This can be run independently or as part of the version bump process
 */

class ChangelogUpdater {
    constructor() {
        this.changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    }

    /**
     * Get commits since last tag
     */
    getCommitsSinceLastTag() {
        try {
            const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
            const commits = execSync(`git log ${lastTag}..HEAD --oneline --format="%s"`, { encoding: 'utf8' });
            return commits.split('\n').filter(Boolean);
        } catch (error) {
            // If no tags exist, get recent commits
            try {
                const commits = execSync('git log -10 --oneline --format="%s"', { encoding: 'utf8' });
                return commits.split('\n').filter(Boolean);
            } catch (err) {
                console.warn('Warning: Could not get git commits');
                return [];
            }
        }
    }

    /**
     * Get all commits for a specific version
     */
    getCommitsForVersion(version) {
        try {
            let commits = [];

            if (version === 'unreleased') {
                // Get commits since last tag
                try {
                    const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
                    commits = execSync(`git log ${lastTag}..HEAD --oneline --format="%s"`, { encoding: 'utf8' })
                        .split('\n')
                        .filter(Boolean);
                } catch (error) {
                    // If no tags, get all commits
                    commits = execSync('git log --oneline --format="%s"', { encoding: 'utf8' })
                        .split('\n')
                        .filter(Boolean);
                }
            } else {
                // Get commits for specific version
                try {
                    const prevTag = execSync(`git describe --tags --abbrev=0 v${version}~1`, { encoding: 'utf8' }).trim();
                    commits = execSync(`git log ${prevTag}..v${version} --oneline --format="%s"`, { encoding: 'utf8' })
                        .split('\n')
                        .filter(Boolean);
                } catch (error) {
                    // If no previous tag, get commits up to this version
                    commits = execSync(`git log v${version} --oneline --format="%s"`, { encoding: 'utf8' })
                        .split('\n')
                        .filter(Boolean);
                }
            }

            return commits;
        } catch (error) {
            console.warn(`Warning: Could not get commits for version ${version}`);
            return [];
        }
    }

    /**
     * Categorize commits by type
     */
    categorizeCommits(commits) {
        const categories = {
            'Breaking Changes': [],
            'Features': [],
            'Bug Fixes': [],
            'Documentation': [],
            'Tests': [],
            'Chores': [],
            'Performance': [],
            'Refactor': []
        };

        for (const commit of commits) {
            if (commit.includes('!:')) {
                categories['Breaking Changes'].push(commit.replace(/^.*?: /, ''));
            } else if (commit.startsWith('feat:')) {
                categories['Features'].push(commit.replace(/^feat: /, ''));
            } else if (commit.startsWith('fix:')) {
                categories['Bug Fixes'].push(commit.replace(/^fix: /, ''));
            } else if (commit.startsWith('perf:')) {
                categories['Performance'].push(commit.replace(/^perf: /, ''));
            } else if (commit.startsWith('refactor:')) {
                categories['Refactor'].push(commit.replace(/^refactor: /, ''));
            } else if (commit.startsWith('docs:')) {
                categories['Documentation'].push(commit.replace(/^docs: /, ''));
            } else if (commit.startsWith('test:')) {
                categories['Tests'].push(commit.replace(/^test: /, ''));
            } else if (commit.startsWith('chore:') || commit.startsWith('ci:') || commit.startsWith('build:')) {
                categories['Chores'].push(commit.replace(/^(chore|ci|build): /, ''));
            }
        }

        return categories;
    }

    /**
     * Generate changelog entry for a version
     */
    generateChangelogEntry(version, commits) {
        const categories = this.categorizeCommits(commits);
        const today = new Date().toISOString().split('T')[0];

        let entry = `## [${version}] - ${today}\n\n`;

        for (const [category, items] of Object.entries(categories)) {
            if (items.length > 0) {
                entry += `### ${category}\n`;
                for (const item of items) {
                    entry += `- ${item}\n`;
                }
                entry += '\n';
            }
        }

        return entry;
    }

    /**
     * Update the changelog file
     */
    updateChangelog() {
        try {
            console.log('📝 Updating changelog...');

            // Read current changelog
            let changelog = fs.readFileSync(this.changelogPath, 'utf8');

            // Get commits since last tag
            const commits = this.getCommitsSinceLastTag();

            if (commits.length === 0) {
                console.log('No new commits found since last tag');
                return;
            }

            // Get current version from package.json
            const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
            const currentVersion = packageJson.version;

            // Generate new changelog entry
            const newEntry = this.generateChangelogEntry(currentVersion, commits);

            // Insert new entry after the header
            const headerEnd = changelog.indexOf('\n## ');
            if (headerEnd !== -1) {
                changelog = changelog.slice(0, headerEnd) + newEntry + changelog.slice(headerEnd);
            } else {
                // If no existing entries, add after the header
                const headerEnd = changelog.indexOf('\n\n');
                changelog = changelog.slice(0, headerEnd + 2) + newEntry + changelog.slice(headerEnd + 2);
            }

            // Write updated changelog
            fs.writeFileSync(this.changelogPath, changelog);
            console.log('✅ Changelog updated successfully');

        } catch (error) {
            console.error('❌ Error updating changelog:', error.message);
            process.exit(1);
        }
    }

    /**
     * Generate a full changelog from git history
     */
    generateFullChangelog() {
        try {
            console.log('📝 Generating full changelog from git history...');

            // Get all tags
            const tags = execSync('git tag --sort=-version:refname', { encoding: 'utf8' })
                .split('\n')
                .filter(Boolean)
                .map(tag => tag.replace('v', ''));

            let fullChangelog = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n`;
            fullChangelog += `The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\n`;
            fullChangelog += `and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n`;

            // Add unreleased section
            const unreleasedCommits = this.getCommitsForVersion('unreleased');
            if (unreleasedCommits.length > 0) {
                fullChangelog += `## [Unreleased]\n\n`;
                const categories = this.categorizeCommits(unreleasedCommits);
                for (const [category, items] of Object.entries(categories)) {
                    if (items.length > 0) {
                        fullChangelog += `### ${category}\n`;
                        for (const item of items) {
                            fullChangelog += `- ${item}\n`;
                        }
                        fullChangelog += '\n';
                    }
                }
            }

            // Add entries for each version
            for (const tag of tags) {
                const commits = this.getCommitsForVersion(tag);
                if (commits.length > 0) {
                    fullChangelog += this.generateChangelogEntry(tag, commits);
                }
            }

            // Write full changelog
            fs.writeFileSync(this.changelogPath, fullChangelog);
            console.log('✅ Full changelog generated successfully');

        } catch (error) {
            console.error('❌ Error generating full changelog:', error.message);
            process.exit(1);
        }
    }

    /**
     * Main method to run the changelog updater
     */
    run() {
        const args = process.argv.slice(2);

        if (args.includes('--full') || args.includes('-f')) {
            this.generateFullChangelog();
        } else {
            this.updateChangelog();
        }
    }
}

// Run the changelog updater if this script is executed directly
if (require.main === module) {
    const updater = new ChangelogUpdater();
    updater.run();
}

module.exports = ChangelogUpdater;

