# UI font licenses

The font assets in `Resources/GardenFonts/` are subsets of the Noto families.
The font family names inside the generated files are changed to `GardenPuzzle`
names. Each font remains under the SIL Open Font License, Version 1.1.

| Generated font | Source | License copy |
|---|---|---|
| `NotoSans.ttf` | https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf/NotoSans | `OFL_NotoSans.txt` |
| `NotoSansCJKkr.otf`, `NotoSansCJKjp.otf`, `NotoSansCJKsc.otf`, `NotoSansCJKtc.otf` | https://github.com/notofonts/noto-cjk/tree/main/Sans/OTF | `OFL_NotoSansCJK.txt` |
| `NotoSansThai.ttf` | Noto Sans + https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf/NotoSansThai | `OFL_NotoSans.txt`, `OFL_NotoSansThai.txt` |
| `NotoSansDevanagari.ttf` | Noto Sans + https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf/NotoSansDevanagari | `OFL_NotoSans.txt`, `OFL_NotoSansDevanagari.txt` |
| Supplemental U+2192 in `NotoSans.ttf`, `NotoSansThai.ttf`, `NotoSansDevanagari.ttf` | https://github.com/notofonts/symbols (Noto Sans Symbols Regular) | `OFL_NotoSansSymbols.txt` |

The build tool is `Tools/Localization/build_fonts.py`. It subsets the exact
characters used in the game's translated UI and includes common price symbols.
Rebuild the fonts when UI copy or supported languages change. The source font
downloads are not part of the game package.

The U+2192 right arrow is a one-character subset of Noto Sans Symbols Regular;
no other supplemental Unicode characters are merged. Its copyright notice is
also retained in the generated font name table. Noto Sans Symbols2 does not
contain U+2192 and is not used in the generated fonts.

Official source: https://notofonts.github.io/symbols/fonts/NotoSansSymbols/full/ttf/NotoSansSymbols-Regular.ttf

Source SHA-256: `A0FAF9EDCC79D99D4C7EC8336DA86464C7146AB2BBC481581DA2500215366FF1`

Official license: https://raw.githubusercontent.com/notofonts/symbols/main/OFL.txt

License SHA-256: `B118DD41337806A5D4797052C77CAF3BD096AED783E5EB21B4D11154351E1AC0`

Regeneration additionally accepts `--symbol-source <NotoSansSymbols-Regular.ttf>`.
The tool preserves existing character coverage and base line-height metrics,
keeps all shaping features, and includes every locale's English fallback.
`--audit-only --report-path <path>` checks actual bundled cmap coverage without
changing Unity assets or using operating-system fonts.
