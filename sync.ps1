# sync.ps1 — Syncs local repo with GitHub

# ---- Config ----
$Root = "C:\Users\Mohamed\Documents\web-app\Hotzy"  # Set to your project root
$Repo = "https://github.com/whitewolfwitcher/mug-5090-clone"  # GitHub repository URL
# ----------------

Set-Location $Root

# Ensure Git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not on PATH. Install Git for Windows first."
    exit 1
}

# Fetch latest changes from GitHub
Write-Host "Fetching latest changes from GitHub..."
git fetch origin

# Stash any uncommitted changes (optional)
git stash -u

# Fast-forward local main to origin/main or rebase current branch
Write-Host "Fast-forwarding to origin/main..."
git checkout main
git reset --hard origin/main

# Apply stashed changes back (optional)
git stash pop

# Show current commit hash
$currentCommit = git rev-parse HEAD
Write-Host "Current commit: $currentCommit"

# Optional: pull latest changes and confirm no conflicts
git pull origin main --rebase

# Confirm success
Write-Host "Local repository is up-to-date with GitHub!"
