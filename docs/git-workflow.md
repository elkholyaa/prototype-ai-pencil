#!/bin/bash

# Step 1: Switch to the master branch and pull the latest changes
git checkout master
git pull origin master

# Step 2: Create a new branch for your feature
git checkout -b feature/new-feature

# Step 3: Make your changes (e.g., add a new folder or files)
mkdir data
touch data/example.txt
echo "This is a test file." > data/example.txt

# Step 4: Stage all changes
git add .

# Step 5: Commit your changes
git commit -m "Add new data folder and example file"

git commit -m "partial fix of ui. reply is not rtf. incoming email text area is not well aligned. See UI screenshot: https://github.com/elkholyaa/prototype-ai-pencil/blob/master/docs/localhost-3000.png"

# Step 6: Push the branch to GitHub
git push origin feature/new-feature

# Step 7: Create a Pull Request (PR) on GitHub
echo "Go to GitHub and create a pull request for 'feature/new-feature' into 'master'."
echo "URL: https://github.com/elkholyaa/prototype-ai-pencil/pull/new/feature/new-feature"

# Step 8: Wait for PR review and approval (if required)
echo "Wait for the PR to be reviewed and approved."

# Step 9: Merge the PR into master
echo "Once approved, merge the PR on GitHub."

# Step 10: Update your local repository
git checkout master
git pull origin master

# Step 11: Delete the feature branch (optional)
git branch -d feature/new-feature
git push origin --delete feature/new-feature

echo "Workflow completed successfully!"