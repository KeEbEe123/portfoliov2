import {
  Github,
  Instagram,
  Mail,
  BookOpen,
  Code2,
  type LucideIcon,
} from "lucide-react";

export type Social = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** shown in plain-text contexts like the footer */
  handle: string;
};

export const EMAIL = "keertan.k@gmail.com";

/** Path to the resume PDF in /public. Drop the file here to enable the button. */
export const RESUME_URL = "/Keertan-Kuppili-Resume.pdf";

export const SOCIALS: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/KeEbEe123",
    icon: Github,
    handle: "KeEbEe123",
  },
  {
    label: "Medium",
    href: "https://medium.com/@keertan.k",
    icon: BookOpen,
    handle: "@keertan.k",
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/keebee/",
    icon: Code2,
    handle: "keebee",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_.keebee._/",
    icon: Instagram,
    handle: "_.keebee._",
  },
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
    icon: Mail,
    handle: EMAIL,
  },
];
