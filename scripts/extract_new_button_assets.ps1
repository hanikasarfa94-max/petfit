Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$buttonsSourcePath = Join-Path $root "assets\new\buttons_new.png"
$samplesSourcePath = Join-Path $root "assets\new\samples.png"
$outputDir = Join-Path $root "assets\derived\ui-kit"

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
Get-ChildItem -Path $outputDir -Filter *.png -ErrorAction SilentlyContinue | Remove-Item -Force

$buttonsSource = [System.Drawing.Bitmap]::FromFile($buttonsSourcePath)
$samplesSource = [System.Drawing.Bitmap]::FromFile($samplesSourcePath)

function Remove-MagentaBackground {
  param(
    [System.Drawing.Bitmap]$Bitmap
  )

  $result = New-Object System.Drawing.Bitmap($Bitmap.Width, $Bitmap.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

  for ($y = 0; $y -lt $Bitmap.Height; $y++) {
    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
      $pixel = $Bitmap.GetPixel($x, $y)
      $distanceToMagenta = [Math]::Sqrt(
        [Math]::Pow($pixel.R - 255, 2) +
        [Math]::Pow($pixel.G - 0, 2) +
        [Math]::Pow($pixel.B - 255, 2)
      )
      $isChroma = ($pixel.R -ge 150 -and $pixel.G -le 110 -and $pixel.B -ge 150 -and $distanceToMagenta -le 200)

      if ($isChroma) {
        $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      }
      else {
        $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $pixel.R, $pixel.G, $pixel.B))
      }
    }
  }

  return $result
}

function Trim-TransparentPadding {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [int]$Padding = 8
  )

  $minX = $Bitmap.Width
  $minY = $Bitmap.Height
  $maxX = -1
  $maxY = -1

  for ($y = 0; $y -lt $Bitmap.Height; $y++) {
    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
      if ($Bitmap.GetPixel($x, $y).A -gt 0) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -lt 0 -or $maxY -lt 0) {
    return $Bitmap
  }

  $left = [Math]::Max(0, $minX - $Padding)
  $top = [Math]::Max(0, $minY - $Padding)
  $right = [Math]::Min($Bitmap.Width - 1, $maxX + $Padding)
  $bottom = [Math]::Min($Bitmap.Height - 1, $maxY + $Padding)
  $width = $right - $left + 1
  $height = $bottom - $top + 1

  $trimmed = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($trimmed)
  $graphics.DrawImage($Bitmap, 0, 0, [System.Drawing.Rectangle]::new($left, $top, $width, $height), [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Dispose()

  return $trimmed
}

function Save-Crop {
  param(
    [System.Drawing.Bitmap]$Source,
    [string]$Name,
    [int]$X,
    [int]$Y,
    [int]$Width,
    [int]$Height,
    [int]$Padding = 8
  )

  $cropRect = [System.Drawing.Rectangle]::new($X, $Y, $Width, $Height)
  $cropped = $Source.Clone($cropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $transparent = Remove-MagentaBackground -Bitmap $cropped
  $trimmed = Trim-TransparentPadding -Bitmap $transparent -Padding $Padding
  $destination = Join-Path $outputDir "$Name.png"
  $trimmed.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)

  $cropped.Dispose()
  $transparent.Dispose()
  $trimmed.Dispose()
}

$assets = @(
  @{ source = "buttons"; name = "icon_button_camera"; x = 62; y = 94; width = 183; height = 165; padding = 6 }
  @{ source = "buttons"; name = "icon_button_drink"; x = 310; y = 90; width = 143; height = 173; padding = 6 }
  @{ source = "buttons"; name = "icon_button_drop"; x = 550; y = 94; width = 129; height = 172; padding = 6 }
  @{ source = "buttons"; name = "icon_button_rest"; x = 765; y = 92; width = 169; height = 174; padding = 6 }
  @{ source = "buttons"; name = "effect_sleep_zzz"; x = 864; y = 104; width = 74; height = 77; padding = 4 }
  @{ source = "buttons"; name = "icon_button_bowl"; x = 983; y = 110; width = 188; height = 159; padding = 6 }
  @{ source = "buttons"; name = "icon_button_bottle"; x = 1213; y = 91; width = 191; height = 199; padding = 6 }
  @{ source = "buttons"; name = "icon_button_cushion"; x = 45; y = 358; width = 200; height = 164; padding = 6 }
  @{ source = "buttons"; name = "icon_button_stats"; x = 312; y = 369; width = 161; height = 142; padding = 6 }
  @{ source = "buttons"; name = "icon_button_back"; x = 546; y = 361; width = 160; height = 161; padding = 6 }
  @{ source = "buttons"; name = "icon_button_settings"; x = 770; y = 360; width = 162; height = 162; padding = 6 }
  @{ source = "buttons"; name = "icon_button_more"; x = 987; y = 360; width = 161; height = 162; padding = 6 }
  @{ source = "buttons"; name = "icon_button_calendar"; x = 1208; y = 354; width = 170; height = 172; padding = 6 }
  @{ source = "buttons"; name = "icon_button_edit"; x = 76; y = 594; width = 150; height = 171; padding = 6 }
  @{ source = "buttons"; name = "icon_button_delete"; x = 313; y = 596; width = 158; height = 171; padding = 6 }
  @{ source = "buttons"; name = "icon_button_confirm"; x = 540; y = 605; width = 161; height = 162; padding = 6 }
  @{ source = "buttons"; name = "icon_button_refresh"; x = 767; y = 604; width = 165; height = 165; padding = 6 }
  @{ source = "buttons"; name = "icon_button_warning"; x = 996; y = 606; width = 169; height = 156; padding = 6 }
  @{ source = "buttons"; name = "icon_button_close"; x = 1221; y = 606; width = 161; height = 162; padding = 6 }
  @{ source = "buttons"; name = "effect_sparkle"; x = 75; y = 841; width = 146; height = 154; padding = 4 }
  @{ source = "buttons"; name = "effect_heart"; x = 301; y = 849; width = 173; height = 151; padding = 4 }
  @{ source = "buttons"; name = "effect_flame"; x = 552; y = 829; width = 136; height = 177; padding = 4 }
  @{ source = "buttons"; name = "effect_drop_ripple"; x = 978; y = 844; width = 199; height = 154; padding = 4 }
  @{ source = "buttons"; name = "sticker_drink_milk_tea"; x = 1229; y = 824; width = 131; height = 190; padding = 4 }

  @{ source = "samples"; name = "shell_button_round_primary"; x = 70; y = 52; width = 229; height = 230; padding = 4 }
  @{ source = "samples"; name = "shell_button_pill_primary_lg"; x = 337; y = 94; width = 393; height = 148; padding = 4 }
  @{ source = "samples"; name = "shell_button_pill_secondary_lg"; x = 770; y = 93; width = 384; height = 149; padding = 4 }
  @{ source = "samples"; name = "shell_button_square_secondary"; x = 1202; y = 86; width = 170; height = 166; padding = 4 }
  @{ source = "samples"; name = "shell_bubble_speech_lg"; x = 67; y = 304; width = 477; height = 175; padding = 4 }
  @{ source = "samples"; name = "shell_bubble_speech_sm"; x = 598; y = 335; width = 248; height = 129; padding = 4 }
  @{ source = "samples"; name = "shell_handle_divider"; x = 909; y = 394; width = 203; height = 32; padding = 4 }
  @{ source = "samples"; name = "shell_chip_secondary_sm"; x = 1206; y = 356; width = 161; height = 88; padding = 4 }
  @{ source = "samples"; name = "shell_button_pill_secondary_long"; x = 76; y = 504; width = 475; height = 89; padding = 4 }
  @{ source = "samples"; name = "shell_button_pill_secondary_md"; x = 605; y = 506; width = 248; height = 86; padding = 4 }
  @{ source = "samples"; name = "shell_button_pill_primary_sm"; x = 901; y = 507; width = 220; height = 85; padding = 4 }
  @{ source = "samples"; name = "shell_button_pill_secondary_sm"; x = 1161; y = 507; width = 208; height = 84; padding = 4 }
  @{ source = "samples"; name = "shell_tab_notch"; x = 78; y = 630; width = 253; height = 83; padding = 4 }
  @{ source = "samples"; name = "shell_chip_md"; x = 394; y = 637; width = 180; height = 76; padding = 4 }
  @{ source = "samples"; name = "shell_chip_sm"; x = 643; y = 637; width = 128; height = 75; padding = 4 }
  @{ source = "samples"; name = "shell_chip_lg"; x = 835; y = 637; width = 177; height = 75; padding = 4 }
  @{ source = "samples"; name = "shell_chip_circle"; x = 1099; y = 628; width = 91; height = 92; padding = 4 }
  @{ source = "samples"; name = "shell_chip_circle_primary"; x = 1270; y = 635; width = 77; height = 78; padding = 4 }
  @{ source = "samples"; name = "shell_card_blank"; x = 73; y = 746; width = 321; height = 115; padding = 4 }
  @{ source = "samples"; name = "shell_card_camera"; x = 109; y = 892; width = 234; height = 149; padding = 4 }
  @{ source = "samples"; name = "shell_card_drink"; x = 448; y = 892; width = 227; height = 149; padding = 4 }
  @{ source = "samples"; name = "shell_card_rest"; x = 768; y = 892; width = 226; height = 149; padding = 4 }
  @{ source = "samples"; name = "shell_card_stats"; x = 1095; y = 892; width = 226; height = 149; padding = 4 }
)

foreach ($asset in $assets) {
  $sourceBitmap = if ($asset.source -eq "samples") { $samplesSource } else { $buttonsSource }
  Save-Crop -Source $sourceBitmap -Name $asset.name -X $asset.x -Y $asset.y -Width $asset.width -Height $asset.height -Padding $asset.padding
}

$buttonsSource.Dispose()
$samplesSource.Dispose()

Write-Output ("Extracted {0} ui-kit assets to {1}" -f $assets.Count, $outputDir)
