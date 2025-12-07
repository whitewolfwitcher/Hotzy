# autosync.ps1 — safely pull latest from origin/main
git status --short

# 1) Stash everything (including untracked) so pull --rebase can run
git stash push -u -m "autosync-$(Get-Date -Format s)"

# 2) Make sure we’re on main and pull latest
git checkout main
git fetch origin
git pull origin main --rebase

# 3) Re-apply your local changes
git stash pop

# 4) If there were conflicts, they’ll be listed. Resolve, then:
#    git add <files>
#    git rebase --continue   (if rebase stopped)
#    or `git commit` if stash created merges.
git status --short

Write-Host "`nDone. If you saw CONFLICTs above, fix them, then run:"
Write-Host "  git add <file> ...; git rebase --continue"
