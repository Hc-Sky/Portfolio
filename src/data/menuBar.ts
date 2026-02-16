/**
 * Menu bar data configuration.
 * Defines the left-side menus and their dropdown items.
 */

export interface MenuDropdownItem {
    label: string;
    /** Window ID to open, or undefined for no action */
    windowId?: string;
    /** External href (opens in new tab) */
    href?: string;
    /** Divider before this item */
    divider?: boolean;
    /** Disabled/grayed out */
    disabled?: boolean;
}

export interface MenuBarItem {
    id: string;
    label: string;
    /** If true, this is the "app name" (bold) */
    isBrand?: boolean;
    /** Direct window to open on click (no dropdown) */
    windowId?: string;
    /** Dropdown items — if present, click opens dropdown */
    dropdown?: MenuDropdownItem[];
}

export const menuBarItems: MenuBarItem[] = [
    {
        id: "portfolio",
        label: "HNC OS Portfolio",
        isBrand: true,
        dropdown: [
            { label: "À propos de HNC OS", windowId: "about" },
            { label: "Préférences…", disabled: true, divider: true },
            { label: "Quitter HNC OS", disabled: true },
        ],
    },
    {
        id: "projects",
        label: "Projects",
        dropdown: [
            { label: "Nutrika", windowId: "nutrika" },
            { label: "HNC Studio", windowId: "hnc-studio" },
            { label: "KakouQuest", windowId: "kakouquest" },
            { label: "GameOnWeb", windowId: "game-on-web" },
        ],
    },
    {
        id: "about",
        label: "About",
        windowId: "about",
    },
    {
        id: "contact",
        label: "Contact",
        windowId: "contact",
    },
    {
        id: "resume",
        label: "Resume",
        windowId: "resume",
    },
];
