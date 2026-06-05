# =====================================================================
#  setup.ps1  —  one-command publish to GitHub Pages (Windows)
# ---------------------------------------------------------------------
#  Prerequisites:
#    • git           (https://git-scm.com)
#    • GitHub CLI    (https://cli.github.com)  ->  run:  gh auth login
#
#  Usage (from this folder, in PowerShell):
#    .\setup.ps1                       # creates a public repo named "love-web"
#    .\setup.ps1 -RepoName my-repo     # custom name
#    .\setup.ps1 -Visibility private   # private repo
# =====================================================================

param(
  [string]$RepoName = "love-web",
  [ValidateSet("public", "private")]
  [string]$Visibility = "public"
)

Write-Host ""
Write-Host "love-web - setup" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow

# 1) Confirm GitHub CLI is authenticated -------------------------------
gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "X  You're not logged into GitHub." -ForegroundColor Red
  Write-Host "   Run:  gh auth login    then re-run this script." -ForegroundColor Red
  exit 1
}

$owner = (gh api user --jq .login).Trim()
Write-Host ("OK Logged in as: {0}" -f $owner) -ForegroundColor Green

# 2) Make sure git knows who you are (uses existing config if present) -
if (-not (git config user.name))  { git config user.name  $owner }
if (-not (git config user.email)) { git config user.email "$owner@users.noreply.github.com" }

# 3) Initialise the repo + first commit --------------------------------
if (-not (Test-Path ".git")) { git init -b main }
git add .
git commit -m "love-web: interactive date proposal site" | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "i  Nothing new to commit (that's fine, continuing)." -ForegroundColor DarkYellow
}

# 4) Create the GitHub repo and push -----------------------------------
Write-Host ("-> Creating {0} repo '{1}' and pushing..." -f $Visibility, $RepoName) -ForegroundColor Cyan
gh repo create $RepoName "--$Visibility" --source . --remote origin --push
if ($LASTEXITCODE -ne 0) {
  Write-Host "X  Repo creation/push failed. If the repo already exists, push manually:" -ForegroundColor Red
  Write-Host "     git remote add origin https://github.com/$owner/$RepoName.git" -ForegroundColor Red
  Write-Host "     git push -u origin main" -ForegroundColor Red
  exit 1
}

# 5) Turn on GitHub Pages using the Actions workflow -------------------
Write-Host "-> Enabling GitHub Pages (source: GitHub Actions)..." -ForegroundColor Cyan
gh api -X POST "repos/$owner/$RepoName/pages" -f "build_type=workflow" 2>$null
# (If this 409/404s it's usually fine — the push already triggered the workflow,
#  or Pages is already on. You can also flip it on under Settings -> Pages.)

Write-Host ""
Write-Host "Done! GitHub Actions is deploying your site now." -ForegroundColor Green
Write-Host ("   Actions:  https://github.com/{0}/{1}/actions" -f $owner, $RepoName)
Write-Host ("   Live URL: https://{0}.github.io/{1}/   (live in ~1-2 min)" -f $owner, $RepoName)
Write-Host ""
Write-Host "Tip: edit js/config.js to set your date, then commit & push again." -ForegroundColor Yellow
