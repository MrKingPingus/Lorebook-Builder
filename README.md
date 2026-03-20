# Lorebook Builder

A self-contained, single-file lorebook creation utility for use with AI writing tools. No installation, no accounts, no server — everything runs in your browser and saves locally.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Entries](#entries)
3. [Trigger Keywords](#trigger-keywords)
4. [Trigger Suggestions](#trigger-suggestions)
5. [Description Field](#description-field)
6. [Search and Filter](#search-and-filter)
7. [Import](#import)
8. [Export and Save](#export-and-save)
9. [Multiple Lorebbooks](#multiple-lorebooks)
10. [Settings](#settings)
11. [Desktop Interface](#desktop-interface)
12. [Mobile Interface](#mobile-interface)

---

## Getting Started

Open `index.html` in any modern browser. You'll see two buttons: one for the desktop builder and one for the mobile builder. They share the same data format and localStorage, so you can switch between them freely.

Everything is stored in your browser's localStorage — nothing is sent anywhere. Autosave runs continuously as you work.

---

## Entries

Each lorebook entry represents a thing the AI should know about: a character, a place, an item, a plot event, or anything else. Entries have four fields:

| Field | Purpose |
|---|---|
| **Entry Name** | The canonical name of the subject |
| **Entry Type** | One of five categories (see below) |
| **Trigger Keywords** | Words that activate this entry during inference |
| **Description** | The actual lorebook content, up to 1500 characters |

### Entry Types

Every entry belongs to one of five types, each with its own color coding:

| Type | Color | Use for |
|---|---|---|
| **Character** | Indigo | People, NPCs, named entities |
| **Item** | Teal | Objects, artifacts, gear |
| **Location** | Amber | Places, regions, landmarks |
| **PlotEvent** | Red | Story beats, events, lore moments |
| **Other** | Teal | Anything that doesn't fit the above |

The color appears as a left border on each entry card and as the highlight color on the corresponding filter button.

### Adding Entries

- **Desktop:** Click the `+ Add Entry` button at the bottom of the entry list, or press **Alt+N**
- **Mobile:** Tap the red **+** button in the bottom-right corner

New entries are added at the bottom of the list.

### Reordering Entries

- **Desktop:** Drag entries by the `⠿` handle on the left side of each entry header, or use the ↑ / ↓ buttons
- **Mobile:** Use the ↑ Move Up / ↓ Move Down buttons inside the entry editor

### Collapsing Entries

Click the entry header (anywhere outside a button) to collapse or expand it. Collapsed entries show the entry name, type dot, and optionally the trigger count and character count.

### Deleting Entries

Use the `Delete` button on the right side of each entry header. This is immediate and cannot be undone within a session (though autosave means a previous state may exist if you reload quickly).

### Clearing All Entries

The **Clear All** button in the footer removes all entries and resets the lorebook name. Use with care.

---

## Trigger Keywords

Triggers are the words or phrases that cause the AI to pull in this lorebook entry. They should be terms likely to appear naturally in the conversation — character names, nicknames, place names, item names, etc.

### Delimiter

Triggers can be separated by either a **comma** (`,`) or a **semicolon** (`;`). The delimiter is set per-entry. If you paste in triggers that contain commas, the builder will automatically detect this and switch that entry to semicolon-delimited mode to avoid splitting on the wrong character.

### Tag Chip Mode (default)

By default, each trigger is displayed as an individual chip/tag. You can:

- Type a trigger and press **Enter** or your delimiter key to add it
- Click the **×** on any chip to remove it
- Edit chips inline

### Compact Mode

In compact mode (enabled in Settings), triggers are shown as a single text field. Type all your triggers in one line, separated by your chosen delimiter. This is faster for bulk entry but less visual.

### Limits

The trigger counter in the bottom-right of the trigger field tracks how many triggers an entry has. The practical limit is **25 triggers** before a warning appears — most lorebook implementations impose limits, so staying under keeps things portable.

---

## Trigger Suggestions

The builder analyzes your entry's name and description to suggest additional triggers you might not have thought of. Suggestions appear in a collapsible tray below the trigger field.

### How Suggestions Are Generated

The engine looks for patterns in your description text:

- **Alias phrases** — text following "known as", "called", "nicknamed", "goes by", "alias", "also known as"
- **Quoted phrases** — anything in quotation marks
- **Parenthetical text** — content inside parentheses

It then applies type-specific logic:

- **Character entries** — generates partial name variants (first name only, last name only), strips honorifics and titles (Lord, Lady, Dr., etc.), capitalizes proper nouns
- **Location entries** — generates "the [name]" variants for locations that don't already start with "the"
- **Item and PlotEvent entries** — applies context-appropriate extraction without name-splitting

Common English stop words are filtered out so you don't get suggestions like "the" or "a".

### Using Suggestions

Click any suggestion chip to add it to the entry's trigger list. Already-added triggers won't appear as suggestions. The tray can be collapsed if you find it distracting — that preference is saved per-session and can be made permanent in Settings.

---

## Description Field

The description field holds the actual lorebook content the AI sees when this entry is triggered. Limit is **1500 characters**, tracked by the counter below the field.

### Counter Colors

The character counter changes color as you approach limits:

**Tiered mode (default):**
- Green — 0 to 750 characters
- Yellow — 750 to 1250
- Red — 1250 to 1500 (and beyond)

**Simple mode:**
- No color change until 1200 characters (yellow), then red at 1500+

Tiered vs. simple mode is toggled in Settings.

### Auto-Growing Height

The description field grows automatically as you type — you won't need to scroll within the field itself. If you want a specific fixed height, drag the **pull tab** (the small pill handle centered at the bottom of the field) up or down to set a manual minimum. Auto-grow still works above that floor.

---

## Search and Filter

### Search

The search bar at the top of the entry list searches entry **names** and **descriptions** simultaneously. Matching entries are highlighted; non-matching entries are dimmed.

### Find & Replace

Switch the mode dropdown next to the search bar from **Search** to **Find & Replace** to reveal a replace field. Once you've typed a search term and there are matches, the **Replace All** button becomes active. This replaces all matches across all entries' names, trigger lists, and descriptions at once.

### Filter by Type

The row of type buttons below the search bar filters which entries are visible:

- Click a type button to show only that type
- **Shift+click** to toggle individual types while keeping others active (multi-select)
- Click **All** to clear all filters and show everything

Active filters are highlighted with the type's accent color.

### Group by Type

The **Group by type** button reorders all entries in the list by type (Character → Item → Location → PlotEvent → Other), without permanently changing the order. Drag-to-reorder still works after grouping.

---

## Import

The builder supports two import paths: **template files** and **JSON**.

### Template Import

Download a blank template (`.txt` or `.docx`) from the Convert tab, fill it out, then upload it back. Two text formats are accepted:

**Block format:**
```
=== Character Name ===
Type: Character
Triggers: name, alias, nickname
Description: A detailed description of the character.

=== Location Name ===
Type: Location
...
```

**Key-value format:**
```
Entry Name: The Iron Keep
Entry Type: Location
Triggers: the keep, iron keep
Description: A frost-covered fortress in the northern wastes.
```

Both formats can be mixed in the same file. Type, Triggers, and Description are all optional — an entry with just a name is valid. Multi-line descriptions are supported; a blank line or the start of a new entry ends the description block.

After uploading, a preview shows how many entries were parsed and a summary of each. You can confirm or cancel before anything is added.

### JSON Import (Save / Load tab)

Paste or upload a previously exported lorebook JSON file. This completely replaces the current lorebook state, so it's best used when starting fresh or switching between projects.

---

## Export and Save

### Autosave

The builder saves automatically to localStorage as you work. The **✓ Saved** indicator in the header confirms each save. Saves are also triggered when you switch browser tabs or close the window.

### JSON Export

From the **Save / Load** tab, use **Copy JSON** or **Download JSON** to export the full lorebook state. This JSON can be re-imported later to resume editing, shared with collaborators, or used directly with tools that accept lorebook JSON.

### Template Export

From the **Convert** tab (desktop) or **Save / Load** section (mobile), download the current lorebook as a `.txt` or `.docx` file in the block template format. This is human-readable and compatible with the import parser if you want to edit offline.

---

## Multiple Lorebooks

You can maintain up to **10 separate lorebooks** at the same time, each with its own name, entries, and save slot.

### Switching Lorebooks

The lorebook name field at the top of the Build panel doubles as an identifier. In the Save / Load section, a dropdown lists all saved lorebooks with their names and last-modified timestamps. Selecting one and clicking **Load** switches to it.

### Creating a New Lorebook

- **Desktop:** Use **New Lorebook** in the Save / Load tab
- **Mobile:** Long-press the FAB and select **New lorebook**

You'll be prompted to save the current lorebook before switching if there are unsaved changes.

### Deleting a Lorebook

In the Save / Load section, select the lorebook from the dropdown and use the delete option. This is permanent.

---

## Settings

Settings are saved to localStorage and persist across sessions.

| Setting | Default | Effect |
|---|---|---|
| **Tiered character counter** | On | Shows green/yellow/red thresholds instead of a simple red-at-1500 warning |
| **Compact trigger input** | Off | Replaces tag chips with a single text field per entry |
| **Hide suggestions by default** | Off | Starts the trigger suggestions tray collapsed |
| **Hide entry stats** | Off | Hides the trigger count and character count from collapsed entry headers |

---

## Desktop Interface

The desktop builder opens as a floating window over the page.

### Tabs

| Tab | Contents |
|---|---|
| **Build** | The main entry editor — add, edit, reorder, search, filter |
| **Convert** | Template download and upload (import from file) |
| **Save / Load** | JSON export/import, lorebook switcher, new/delete lorebook |
| **Settings** | Toggle preferences |

### Resizing the Window

Drag any of the four **corner handles** (the small L-shaped ticks at each corner) to resize the builder. Resizing is symmetric — the center of the window stays fixed as both opposite sides move together. The window snaps to a minimum size of 480×320px.

The window's size and position are saved to localStorage and restored the next time you open the builder.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| **Alt+N** | Add a new entry, scroll to it, and focus the name field |

---

## Mobile Interface

The mobile builder is a fullscreen modal optimized for touch.

### Navigation

A tab bar at the bottom of the screen switches between sections:

| Tab | Contents |
|---|---|
| **Build** | Entry list and editor |
| **Convert** | Template import |
| **Save / Load** | JSON and template export, lorebook switching |
| **Settings** | Toggle preferences |

### FAB (Floating Action Button)

The red **+** button in the bottom-right corner is the primary action button.

- **Tap** — add a new entry immediately
- **Long-press** — open the quick-action menu:
  - **New entry** — same as a tap
  - **Import entries** — open the import sheet
  - **New lorebook** — start a fresh lorebook (prompts to save first)

### Import Sheet

The import sheet slides up from the bottom. Paste text directly or upload a file, preview the parsed entries, and confirm to add them.

### Pull Tab (Description Field)

Same as desktop — the description field auto-grows as you type, and the pill handle at the bottom lets you drag to a fixed minimum height. Touch drag is fully supported.

---

## Data & Privacy

All data is stored in your browser's **localStorage** under keys prefixed with `_lorebook_`. Nothing leaves your device. Clearing your browser's site data will erase all saved lorebooks — export to JSON first if you want a backup.

localStorage keys used:

| Key | Contents |
|---|---|
| `_lorebook_index` | List of all lorebook slots (names, keys, timestamps) |
| `_lorebook_[id]` | Full lorebook data for each slot |
| `_lb_window_pos` | Desktop window size and position |
| `_lb_tiered_counter` | Settings toggle state |
| `_lb_compact_triggers` | Settings toggle state |
| `_lb_sugs_collapsed` | Settings toggle state |
| `_lb_hide_stats` | Settings toggle state |
