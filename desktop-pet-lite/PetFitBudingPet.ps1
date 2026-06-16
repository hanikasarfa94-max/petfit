param(
  [switch]$SelfTest,
  [switch]$SmokeTest
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$assetRoot = Join-Path $root 'assets'

$moods = @(
  @{
    Key = 'happy'
    Label = 'Buding'
    Hint = 'Tap me'
    Frames = @(
      'character_buding_idle_front.png',
      'character_buding_smile.png',
      'character_buding_wave.png',
      'character_buding_success_wave.png',
      'character_buding_celebrate.png',
      'character_buding_wave.png'
    )
  },
  @{
    Key = 'idle'
    Label = 'PetFit'
    Hint = 'Ready for a tiny walk?'
    Frames = @(
      'character_buding_idle_front.png',
      'character_buding_smile.png',
      'character_buding_stretch.png',
      'character_buding_turn_right.png',
      'character_buding_walk_left.png',
      'character_buding_idle_front.png'
    )
  },
  @{
    Key = 'hungry'
    Label = 'Hungry'
    Hint = 'Snack check'
    Frames = @(
      'character_buding_hungry_empty_bowl.png',
      'character_buding_worried.png',
      'character_buding_eat_strawberry.png',
      'character_buding_smile.png'
    )
  },
  @{
    Key = 'thirsty'
    Label = 'Thirsty'
    Hint = 'Water break'
    Frames = @(
      'character_buding_thirsty_empty_bottle.png',
      'character_buding_confused.png',
      'character_buding_drink_water.png',
      'character_buding_smile.png'
    )
  },
  @{
    Key = 'sleepy'
    Label = 'Sleepy'
    Hint = 'Nap mode'
    Frames = @(
      'character_buding_yawn_sleepy.png',
      'character_buding_sleep_curl.png',
      'character_buding_sleeping_blue_cushion.png',
      'character_buding_sleeping_blue_cushion.png'
    )
  }
)

foreach ($mood in $moods) {
  foreach ($frame in $mood.Frames) {
    $path = Join-Path $assetRoot $frame
    if (-not (Test-Path $path)) {
      throw "Missing pet asset: $path"
    }
  }
}

if ($SelfTest) {
  Write-Host "PetFit lite desktop pet assets OK."
  exit 0
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

function New-RoundedRectanglePath {
  param(
    [System.Drawing.Rectangle]$Bounds,
    [int]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $arc = New-Object System.Drawing.Rectangle($Bounds.X, $Bounds.Y, $diameter, $diameter)

  $path.AddArc($arc, 180, 90)
  $arc.X = $Bounds.Right - $diameter
  $path.AddArc($arc, 270, 90)
  $arc.Y = $Bounds.Bottom - $diameter
  $path.AddArc($arc, 0, 90)
  $arc.X = $Bounds.X
  $path.AddArc($arc, 90, 90)
  $path.CloseFigure()

  return $path
}

$form = New-Object System.Windows.Forms.Form
$form.Text = 'PetFit Buding'
$form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None
$form.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
$form.ShowInTaskbar = $true
$form.TopMost = $true
$form.Width = 246
$form.Height = 302
$form.MinimumSize = New-Object System.Drawing.Size(220, 270)
$form.BackColor = [System.Drawing.Color]::FromArgb(252, 248, 239)

$workingArea = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
$form.Left = $workingArea.Right - $form.Width - 28
$form.Top = $workingArea.Bottom - $form.Height - 28
$form.Region = New-Object System.Drawing.Region (New-RoundedRectanglePath -Bounds (New-Object System.Drawing.Rectangle(0, 0, $form.Width, $form.Height)) -Radius 22)

$accent = [System.Drawing.Color]::FromArgb(41, 126, 116)
$ink = [System.Drawing.Color]::FromArgb(45, 48, 56)
$muted = [System.Drawing.Color]::FromArgb(109, 113, 122)
$panel = [System.Drawing.Color]::FromArgb(255, 255, 251)

$title = New-Object System.Windows.Forms.Label
$title.AutoSize = $false
$title.Left = 16
$title.Top = 12
$title.Width = 122
$title.Height = 22
$title.Text = 'Buding'
$title.Font = New-Object System.Drawing.Font('Segoe UI', 10, [System.Drawing.FontStyle]::Bold)
$title.ForeColor = $ink
$title.BackColor = [System.Drawing.Color]::Transparent
$form.Controls.Add($title)

$pinButton = New-Object System.Windows.Forms.Button
$pinButton.Left = 155
$pinButton.Top = 9
$pinButton.Width = 34
$pinButton.Height = 28
$pinButton.Text = 'Pin'
$pinButton.Font = New-Object System.Drawing.Font('Segoe UI', 8)
$pinButton.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$pinButton.FlatAppearance.BorderSize = 0
$pinButton.BackColor = [System.Drawing.Color]::FromArgb(222, 241, 238)
$pinButton.ForeColor = $accent
$form.Controls.Add($pinButton)

$closeButton = New-Object System.Windows.Forms.Button
$closeButton.Left = 198
$closeButton.Top = 9
$closeButton.Width = 32
$closeButton.Height = 28
$closeButton.Text = 'X'
$closeButton.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
$closeButton.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$closeButton.FlatAppearance.BorderSize = 0
$closeButton.BackColor = [System.Drawing.Color]::FromArgb(247, 226, 221)
$closeButton.ForeColor = [System.Drawing.Color]::FromArgb(157, 62, 50)
$form.Controls.Add($closeButton)

$picture = New-Object System.Windows.Forms.PictureBox
$picture.Left = 22
$picture.Top = 44
$picture.Width = 202
$picture.Height = 178
$picture.SizeMode = [System.Windows.Forms.PictureBoxSizeMode]::Zoom
$picture.BackColor = [System.Drawing.Color]::Transparent
$form.Controls.Add($picture)

$bubble = New-Object System.Windows.Forms.Label
$bubble.Left = 18
$bubble.Top = 219
$bubble.Width = 210
$bubble.Height = 32
$bubble.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter
$bubble.Font = New-Object System.Drawing.Font('Segoe UI', 9)
$bubble.ForeColor = $muted
$bubble.BackColor = $panel
$form.Controls.Add($bubble)

$moodButtons = @()
$buttonNames = @('Happy', 'Snack', 'Water', 'Nap')
for ($i = 0; $i -lt $buttonNames.Count; $i++) {
  $button = New-Object System.Windows.Forms.Button
  $button.Left = 15 + ($i * 55)
  $button.Top = 260
  $button.Width = 50
  $button.Height = 28
  $button.Text = $buttonNames[$i]
  $button.Tag = @(0, 2, 3, 4)[$i]
  $button.Font = New-Object System.Drawing.Font('Segoe UI', 8)
  $button.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
  $button.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(220, 222, 219)
  $button.BackColor = $panel
  $button.ForeColor = $ink
  $form.Controls.Add($button)
  $moodButtons += $button
}

$contextMenu = New-Object System.Windows.Forms.ContextMenuStrip
$topMostItem = $contextMenu.Items.Add('Always on top')
$topMostItem.Checked = $true
$topMostItem.CheckOnClick = $true
$exitItem = $contextMenu.Items.Add('Exit')
$form.ContextMenuStrip = $contextMenu

$script:currentMood = 0
$script:currentFrame = 0
$script:dragging = $false
$script:dragStart = New-Object System.Drawing.Point
$script:formStart = New-Object System.Drawing.Point
$script:tick = 0
$script:frameTick = 0
$script:lastImage = $null

function Set-Frame {
  param([int]$FrameIndex)

  $mood = $moods[$script:currentMood]
  if ($FrameIndex -lt 0 -or $FrameIndex -ge $mood.Frames.Count) {
    $FrameIndex = 0
  }

  $script:currentFrame = $FrameIndex
  $path = Join-Path $assetRoot $mood.Frames[$FrameIndex]
  $nextImage = [System.Drawing.Image]::FromFile($path)

  if ($script:lastImage -ne $null) {
    $oldImage = $script:lastImage
    $picture.Image = $null
    $oldImage.Dispose()
  }

  $script:lastImage = $nextImage
  $picture.Image = $nextImage
}

function Set-Mood {
  param([int]$Index)

  if ($Index -lt 0 -or $Index -ge $moods.Count) {
    $Index = 0
  }

  $script:currentMood = $Index
  $script:currentFrame = 0
  $script:frameTick = 0
  $mood = $moods[$Index]
  $title.Text = $mood.Label
  $bubble.Text = $mood.Hint
  Set-Frame 0
}

function Start-Drag {
  param($Sender, $EventArgs)

  if ($EventArgs.Button -eq [System.Windows.Forms.MouseButtons]::Left) {
    $script:dragging = $true
    $script:dragStart = [System.Windows.Forms.Control]::MousePosition
    $script:formStart = New-Object System.Drawing.Point($form.Left, $form.Top)
  }
}

function Move-Drag {
  param($Sender, $EventArgs)

  if (-not $script:dragging) {
    return
  }

  $current = [System.Windows.Forms.Control]::MousePosition
  $form.Left = $script:formStart.X + ($current.X - $script:dragStart.X)
  $form.Top = $script:formStart.Y + ($current.Y - $script:dragStart.Y)
}

function Stop-Drag {
  $script:dragging = $false
}

$dragTargets = @($form, $picture, $title, $bubble)
foreach ($target in $dragTargets) {
  $target.Add_MouseDown({ Start-Drag $this $_ })
  $target.Add_MouseMove({ Move-Drag $this $_ })
  $target.Add_MouseUp({ Stop-Drag })
}

$picture.Add_Click({
  Set-Mood (($script:currentMood + 1) % $moods.Count)
})

foreach ($button in $moodButtons) {
  $button.Add_Click({
    Set-Mood ([int]$this.Tag)
  })
}

$pinButton.Add_Click({
  $form.TopMost = -not $form.TopMost
  $topMostItem.Checked = $form.TopMost
  $pinButton.BackColor = if ($form.TopMost) { [System.Drawing.Color]::FromArgb(222, 241, 238) } else { [System.Drawing.Color]::FromArgb(235, 235, 235) }
})

$topMostItem.Add_Click({
  $form.TopMost = $topMostItem.Checked
})

$closeButton.Add_Click({ $form.Close() })
$exitItem.Add_Click({ $form.Close() })

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 90
$timer.Add_Tick({
  $script:tick++
  $script:frameTick++
  $picture.Top = 44 + [int](3 * [Math]::Sin($script:tick / 9))

  if ($script:frameTick -ge 7) {
    $script:frameTick = 0
    $mood = $moods[$script:currentMood]
    Set-Frame (($script:currentFrame + 1) % $mood.Frames.Count)
  }
})

$form.Add_Resize({
  $form.Region = New-Object System.Drawing.Region (New-RoundedRectanglePath -Bounds (New-Object System.Drawing.Rectangle(0, 0, $form.Width, $form.Height)) -Radius 22)
})

$form.Add_FormClosed({
  $timer.Stop()
  if ($script:lastImage -ne $null) {
    $script:lastImage.Dispose()
  }
})

Set-Mood 0
$timer.Start()

if ($SmokeTest) {
  $smokeTimer = New-Object System.Windows.Forms.Timer
  $smokeTimer.Interval = 350
  $smokeTimer.Add_Tick({
    $smokeTimer.Stop()
    $form.Close()
  })
  $smokeTimer.Start()
}

[System.Windows.Forms.Application]::Run($form)
