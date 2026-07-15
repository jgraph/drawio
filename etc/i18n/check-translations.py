#!/usr/bin/env python3
"""Checks that every key in dia.txt exists in all other dia_*.txt files.

dia.txt (English) is the source language and defines the key set. This
script reports, for each dia_<lang>.txt in src/main/webapp/resources:

  - missing keys (present in dia.txt, absent from the language file)
  - extra keys (present in the language file, absent from dia.txt)
  - duplicate keys and malformed (no '=') lines

Exits non-zero if any language file is missing a key, so it can act as a
CI guard. Fixes are not applied automatically: new values need actual
translations (the sortPages backfill in July 2026 was done by fanning the
missing entries out to per-language-family translator subagents).

Conventions for adding a missing key manually:
  - insert the line at the same position relative to its dia.txt
    neighbours (the language files share a common ordering)
  - ar/fa/he wrap translated values in U+202B ... U+202C directional marks
  - dia_i18n.txt is a pseudo-language whose value is the key itself
"""
import glob
import os
import sys

RES = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "..", "..", "src", "main", "webapp", "resources")


def parse(path):
    """Returns (ordered (key, value) list, duplicate keys, malformed lines)."""
    entries, dups, bad = [], [], []
    seen = set()
    with open(path, encoding="utf-8") as f:
        for n, line in enumerate(f, 1):
            line = line.rstrip("\n")
            if not line.strip():
                continue
            if "=" not in line:
                bad.append(n)
                continue
            k, v = line.split("=", 1)
            if k in seen:
                dups.append(k)
            seen.add(k)
            entries.append((k, v))
    return entries, dups, bad


def main():
    base_entries, base_dups, base_bad = parse(os.path.join(RES, "dia.txt"))
    base_keys = [k for k, _ in base_entries]
    base_set = set(base_keys)
    print(f"dia.txt: {len(base_entries)} entries, "
          f"{len(base_dups)} duplicates, {len(base_bad)} malformed lines")

    total_missing = 0
    for path in sorted(glob.glob(os.path.join(RES, "dia_*.txt"))):
        name = os.path.basename(path)
        entries, dups, bad = parse(path)
        keys = {k for k, _ in entries}
        missing = [k for k in base_keys if k not in keys]
        extra = sorted(k for k in keys if k not in base_set)
        total_missing += len(missing)

        flags = []
        if missing:
            flags.append(f"MISSING:{missing}")
        if extra:
            flags.append(f"EXTRA:{extra}")
        if dups:
            flags.append(f"DUPLICATES:{sorted(set(dups))}")
        if bad:
            flags.append(f"MALFORMED-LINES:{bad}")
        status = " ".join(flags) if flags else "ok"
        print(f"{name}: {len(entries)} entries, {status}")

    if total_missing:
        print(f"\nFAIL: {total_missing} missing entries across language files")
        return 1
    print("\nOK: no missing entries")
    return 0


if __name__ == "__main__":
    sys.exit(main())
