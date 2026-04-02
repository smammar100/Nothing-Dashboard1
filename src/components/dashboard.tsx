"use client";

import {
  ArrowUpRight,
  BedDouble,
  Bell,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DoorOpen,
  Globe,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  UtensilsCrossed,
  Wallet,
  Wrench,
  CreditCard,
  ChevronsUpDown,
  Sun,
  Moon,
} from "lucide-react";
import * as React from "react";
import {
  Bar,
  BarChart,
  Customized,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type NavItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  isActive?: boolean;
  children?: NavItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
};

type UserData = {
  name: string;
  email: string;
  avatar: string;
};

type SidebarData = {
  logo: { title: string; subtitle: string };
  navGroups: NavGroup[];
  user?: UserData;
};

type HotelAction = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type Guest = {
  name: string;
  avatar?: string;
  initials: string;
};

type Booking = {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  time: string;
  guests: Guest[];
  guestCount: number;
  source: "Direct" | "Booking.com" | "Expedia" | "Walk-in";
  status: string;
  statusColor: string;
  nights: number;
  specialRequests?: string;
};

type AvailabilityStatus = "available" | "partial" | "full";

type AvailabilityDateCell = {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  status: AvailabilityStatus;
};

type SalesTrendPoint = {
  key: string;
  month: string;
  monthLabel: string;
  xLabel: string;
  segment: number;
  directBookings: number;
  otaBookings: number;
  total: number;
};

type ChartOffset = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type SalesTrendBarShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: SalesTrendPoint;
};

// ─────────────────────────────────────────────
// Nothing color constants (inline for chart SVG)
// ─────────────────────────────────────────────

// Default dark values (used for SSR and as fallback)
const ND_DARK = {
  black: "#000000",
  surface: "#111111",
  surfaceRaised: "#1A1A1A",
  border: "#222222",
  borderVisible: "#333333",
  textDisabled: "#666666",
  textSecondary: "#999999",
  textPrimary: "#E8E8E8",
  textDisplay: "#FFFFFF",
  accent: "#D71921",
  success: "#4A9E5C",
  warning: "#D4A843",
} as const;

const ND_LIGHT = {
  black: "#FFFFFF",
  surface: "#F5F5F5",
  surfaceRaised: "#EBEBEB",
  border: "#E0E0E0",
  borderVisible: "#CCCCCC",
  textDisabled: "#AAAAAA",
  textSecondary: "#777777",
  textPrimary: "#2A2A2A",
  textDisplay: "#000000",
  accent: "#D71921",
  success: "#3A8A4A",
  warning: "#B8912E",
} as const;

type NDTokens = typeof ND_DARK;

const ThemeContext = React.createContext<{ theme: "dark" | "light"; toggle: () => void; nd: NDTokens }>({
  theme: "dark",
  toggle: () => {},
  nd: ND_DARK,
});

const useTheme = () => React.useContext(ThemeContext);
const useND = () => React.useContext(ThemeContext).nd;

// Keep a mutable reference for components that read ND outside React context
let ND: NDTokens = ND_DARK;

const numberFormatter = new Intl.NumberFormat("en-US");

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const sidebarData: SidebarData = {
  logo: { title: "GRANDVIEW", subtitle: "HOSPITALITY SUITE" },
  navGroups: [
    {
      title: "Front Office",
      defaultOpen: true,
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "#", isActive: true },
        { label: "Reservations", icon: CalendarRange, href: "#" },
        { label: "Check-in / Check-out", icon: DoorOpen, href: "#" },
        {
          label: "Guest Profiles",
          icon: Users,
          href: "#",
          children: [
            { label: "All Guests", icon: Users, href: "#" },
            { label: "Loyalty Members", icon: Users, href: "#" },
            { label: "Corporate Accounts", icon: Users, href: "#" },
          ],
        },
      ],
    },
    {
      title: "Property",
      defaultOpen: true,
      items: [
        {
          label: "Rooms & Suites",
          icon: BedDouble,
          href: "#",
          children: [
            { label: "Floor Plan", icon: BedDouble, href: "#" },
            { label: "Room Types", icon: BedDouble, href: "#" },
            { label: "Availability", icon: BedDouble, href: "#" },
          ],
        },
        { label: "Housekeeping", icon: Sparkles, href: "#" },
        { label: "Dining & Events", icon: UtensilsCrossed, href: "#" },
      ],
    },
    {
      title: "Revenue",
      defaultOpen: false,
      items: [
        { label: "Rate Manager", icon: CreditCard, href: "#" },
        { label: "Billing & Invoices", icon: Wallet, href: "#" },
        { label: "Channel Distribution", icon: Globe, href: "#" },
      ],
    },
    {
      title: "Administration",
      defaultOpen: false,
      items: [
        { label: "Staff & Roles", icon: ShieldCheck, href: "#" },
        { label: "Maintenance Logs", icon: Wrench, href: "#" },
        { label: "Security & Access", icon: KeyRound, href: "#" },
      ],
    },
  ],
  user: {
    name: "Robert Austin",
    email: "robert@grandview.hotel",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar22.jpg",
  },
};

const hotelActions: HotelAction[] = [
  { title: "Assign Rooms", icon: DoorOpen },
  { title: "Check In Guests", icon: BedDouble },
  { title: "Housekeeping Queue", icon: ClipboardList },
  { title: "Review VIP Arrivals", icon: Users },
];

const operationsMeta = [
  { label: "Date", value: "Tue, Jun 18" },
  { label: "Arrivals", value: "18 check-ins" },
  { label: "Ready rooms", value: "12 cleared" },
  { label: "VIP guests", value: "3 flagged" },
];

const RECENT_ARRIVALS_TABLE: Booking[] = [
  {
    id: "arr-1",
    guestName: "James Brown",
    roomNumber: "412",
    roomType: "Suite",
    time: "2:00 PM Check-in",
    guests: [{ name: "James Brown", avatar: "https://i.pravatar.cc/32?img=12", initials: "JB" }, { name: "Maria Brown", avatar: "https://i.pravatar.cc/32?img=25", initials: "MB" }],
    guestCount: 4,
    source: "Direct",
    status: "VIP",
    statusColor: "accent",
    nights: 3,
    specialRequests: "Late check-out, extra pillows",
  },
  {
    id: "arr-2",
    guestName: "Sarah & Tom Lee",
    roomNumber: "215",
    roomType: "Deluxe",
    time: "3:00 PM Check-in",
    guests: [{ name: "Sarah Lee", avatar: "https://i.pravatar.cc/32?img=32", initials: "SL" }, { name: "Tom Lee", avatar: "https://i.pravatar.cc/32?img=15", initials: "TL" }],
    guestCount: 2,
    source: "Booking.com",
    status: "Confirmed",
    statusColor: "success",
    nights: 5,
  },
  {
    id: "arr-3",
    guestName: "Michael Chen",
    roomNumber: "108",
    roomType: "Standard",
    time: "4:00 PM Check-in",
    guests: [{ name: "Michael Chen", avatar: "https://i.pravatar.cc/32?img=53", initials: "MC" }],
    guestCount: 1,
    source: "Expedia",
    status: "Pending",
    statusColor: "warning",
    nights: 2,
    specialRequests: "Ground floor preferred",
  },
  {
    id: "arr-4",
    guestName: "Emily Davis",
    roomNumber: "501",
    roomType: "Penthouse",
    time: "5:30 PM Check-in",
    guests: [{ name: "Emily Davis", avatar: "https://i.pravatar.cc/32?img=44", initials: "ED" }, { name: "Ryan Davis", avatar: "https://i.pravatar.cc/32?img=18", initials: "RD" }, { name: "Sophie Davis", initials: "SD" }],
    guestCount: 5,
    source: "Direct",
    status: "VIP",
    statusColor: "accent",
    nights: 7,
    specialRequests: "Airport transfer, champagne on arrival",
  },
  {
    id: "arr-5",
    guestName: "Noah Wilson",
    roomNumber: "306",
    roomType: "Deluxe",
    time: "6:00 PM Check-in",
    guests: [{ name: "Noah Wilson", avatar: "https://i.pravatar.cc/32?img=61", initials: "NW" }],
    guestCount: 2,
    source: "Booking.com",
    status: "Confirmed",
    statusColor: "success",
    nights: 4,
    specialRequests: "High floor",
  },
  {
    id: "arr-6",
    guestName: "Olivia Martin",
    roomNumber: "119",
    roomType: "Standard",
    time: "6:30 PM Check-in",
    guests: [{ name: "Olivia Martin", avatar: "https://i.pravatar.cc/32?img=47", initials: "OM" }],
    guestCount: 1,
    source: "Direct",
    status: "Confirmed",
    statusColor: "success",
    nights: 2,
    specialRequests: "Near elevator",
  },
  {
    id: "arr-7",
    guestName: "Liam Thompson",
    roomNumber: "522",
    roomType: "Suite",
    time: "7:00 PM Check-in",
    guests: [{ name: "Liam Thompson", avatar: "https://i.pravatar.cc/32?img=68", initials: "LT" }],
    guestCount: 3,
    source: "Expedia",
    status: "Pending",
    statusColor: "warning",
    nights: 5,
    specialRequests: "Baby crib",
  },
  {
    id: "arr-8",
    guestName: "Ava Rodriguez",
    roomNumber: "227",
    roomType: "Deluxe",
    time: "7:20 PM Check-in",
    guests: [{ name: "Ava Rodriguez", avatar: "https://i.pravatar.cc/32?img=36", initials: "AR" }],
    guestCount: 2,
    source: "Walk-in",
    status: "Confirmed",
    statusColor: "success",
    nights: 1,
    specialRequests: "Late dinner reservation",
  },
  {
    id: "arr-9",
    guestName: "Ethan Brooks",
    roomNumber: "402",
    roomType: "Suite",
    time: "8:00 PM Check-in",
    guests: [{ name: "Ethan Brooks", avatar: "https://i.pravatar.cc/32?img=34", initials: "EB" }, { name: "Lara Brooks", avatar: "https://i.pravatar.cc/32?img=66", initials: "LB" }],
    guestCount: 4,
    source: "Direct",
    status: "VIP",
    statusColor: "accent",
    nights: 3,
    specialRequests: "Fruit basket",
  },
  {
    id: "arr-10",
    guestName: "Mia Sanchez",
    roomNumber: "143",
    roomType: "Standard",
    time: "8:20 PM Check-in",
    guests: [{ name: "Mia Sanchez", avatar: "https://i.pravatar.cc/32?img=57", initials: "MS" }],
    guestCount: 1,
    source: "Booking.com",
    status: "Confirmed",
    statusColor: "success",
    nights: 2,
    specialRequests: "Quiet room",
  },
];

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─────────────────────────────────────────────
// Chart data
// ─────────────────────────────────────────────

const SALES_TREND_MAX = 200;
const SALES_TREND_CELL_STEP = 12;
const SALES_TREND_CELL_SIZE = 8;
const SALES_TREND_CELL_INSET = 2;

const salesTrendMonths = [
  { key: "jan", label: "JAN" }, { key: "feb", label: "FEB" }, { key: "mar", label: "MAR" },
  { key: "apr", label: "APR" }, { key: "may", label: "MAY" }, { key: "jun", label: "JUN" },
  { key: "jul", label: "JUL" }, { key: "aug", label: "AUG" }, { key: "sep", label: "SEP" },
  { key: "oct", label: "OCT" }, { key: "nov", label: "NOV" }, { key: "dec", label: "DEC" },
];

const directBookingPeaks = [58, 54, 60, 72, 78, 92, 110, 102, 84, 88, 70, 76];
const otaBookingPeaks = [34, 32, 38, 44, 52, 58, 68, 64, 50, 54, 42, 46];
const intraMonthPattern = [0.14, 0.31, 0.52, 0.76, 1, 0.61];

function createSalesTrendData() {
  return salesTrendMonths.flatMap((month, monthIndex) =>
    intraMonthPattern.map((patternFactor, segmentIndex) => {
      const wave = Math.sin((monthIndex * 6 + segmentIndex) / 4.2) * 2.8;
      const pulse = segmentIndex === 4 ? 6 : 0;
      const directBookings = Math.max(6, Math.round(directBookingPeaks[monthIndex] * patternFactor + wave + pulse));
      const otaBookings = Math.max(4, Math.round(otaBookingPeaks[monthIndex] * patternFactor + wave * 0.45));
      return {
        key: `${month.key}-${segmentIndex}`,
        month: month.key,
        monthLabel: month.label,
        xLabel: segmentIndex === 0 ? month.label : "",
        segment: segmentIndex,
        directBookings,
        otaBookings,
        total: directBookings + otaBookings,
      };
    }),
  );
}

const revenueChartConfig = {
  directBookings: { label: "Direct", color: ND.textDisplay },
  otaBookings: { label: "OTA", color: ND.textDisabled },
} satisfies ChartConfig;


// ─────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────

const SidebarLogo = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" tooltip="Grandview">
        <div className="flex aspect-square size-8 items-center justify-center bg-nd-text-display" style={{ borderRadius: 4 }}>
          <span className="text-xs font-bold text-nd-black" style={{ fontFamily: "Doto, monospace" }}>G</span>
        </div>
        <div className="flex flex-col gap-0">
          <span className="nd-label text-nd-text-display" style={{ fontSize: 12, letterSpacing: "0.12em" }}>
            {sidebarData.logo.title}
          </span>
          <span className="nd-label" style={{ fontSize: 9 }}>
            {sidebarData.logo.subtitle}
          </span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

const NavMenuItem = ({ item }: { item: NavItem }) => {
  const Icon = item.icon;
  const hasChildren = (item.children?.length ?? 0) > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton render={<a href={item.href} />} isActive={item.isActive} tooltip={item.label} className={cn(item.isActive && "text-nd-text-display")}>
            <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
            <span>{item.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen>
      <SidebarMenuItem className="group/collapsible">
        <CollapsibleTrigger className="w-full">
          <SidebarMenuButton isActive={item.isActive} tooltip={item.label}>
            <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
            <span>{item.label}</span>
            <ChevronRight className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" aria-hidden="true" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children!.map((child) => (
              <SidebarMenuSubItem key={child.label}>
                <SidebarMenuSubButton render={<a href={child.href} />} isActive={child.isActive}>
                  {child.label}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const NavUser = ({ user }: { user: UserData }) => (
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <SidebarMenuButton size="lg" className="data-[state=open]:bg-nd-surface">
            <Avatar className="size-7" style={{ borderRadius: 4 }}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback style={{ borderRadius: 4 }} className="bg-nd-surface-raised text-nd-text-secondary text-[9px]">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm text-nd-text-primary">{user.name}</span>
              <span className="nd-label truncate" style={{ fontSize: 10 }}>{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-3.5 text-nd-text-disabled" aria-hidden="true" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56 border-nd-border-visible bg-nd-surface-raised" style={{ borderRadius: 8 }} side="bottom" align="end" sideOffset={4}>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-2 py-2 text-left">
              <Avatar className="size-7" style={{ borderRadius: 4 }}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback style={{ borderRadius: 4 }}>{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm text-nd-text-primary">{user.name}</span>
                <span className="nd-label truncate" style={{ fontSize: 10 }}>{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-nd-border" />
          <DropdownMenuItem className="text-nd-text-secondary hover:text-nd-text-primary">
            <User className="mr-2 size-4" strokeWidth={1.5} aria-hidden="true" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-nd-border" />
          <DropdownMenuItem className="text-nd-text-secondary hover:text-nd-text-primary">
            <LogOut className="mr-2 size-4" strokeWidth={1.5} aria-hidden="true" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
);

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar variant="inset" collapsible="icon" {...props}>
    <SidebarHeader>
      <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col">
        <SidebarLogo />
        <SidebarTrigger className="ml-auto text-nd-text-disabled hover:text-nd-text-primary group-data-[collapsible=icon]:ml-0" />
      </div>
    </SidebarHeader>
    <SidebarContent>
      <ScrollArea className="h-full">
        {sidebarData.navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="nd-label">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavMenuItem key={item.label} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </ScrollArea>
    </SidebarContent>
    <SidebarFooter>
      <div className="border-t border-nd-border pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<a href="#" />} tooltip="Settings">
                <Settings className="size-4" strokeWidth={1.5} aria-hidden="true" />
                <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
      {sidebarData.user && <NavUser user={sidebarData.user} />}
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
);

// ─────────────────────────────────────────────
// Dashboard Header
// ─────────────────────────────────────────────

const DashboardHeader = () => {
  const { theme, toggle } = useTheme();
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 flex w-full shrink-0 items-center justify-between border-b border-nd-border px-6 py-4">
      <div>
        <h1 className="text-lg font-medium tracking-tight text-nd-text-display">Dashboard</h1>
        <p className="nd-label mt-0.5">FRONT OFFICE / MORNING SHIFT</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="flex size-9 items-center justify-center border border-nd-border-visible text-nd-text-secondary transition-colors hover:border-nd-text-primary hover:text-nd-text-primary" style={{ borderRadius: 999 }} aria-label="Search">
          <Search className="size-4" strokeWidth={1.5} />
        </button>
        <button type="button" className="flex size-9 items-center justify-center border border-nd-border-visible text-nd-text-secondary transition-colors hover:border-nd-text-primary hover:text-nd-text-primary" style={{ borderRadius: 999 }} aria-label="Notifications">
          <Bell className="size-4" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={toggle}
          className="flex size-9 items-center justify-center border border-nd-border-visible text-nd-text-secondary transition-colors hover:border-nd-text-primary hover:text-nd-text-primary"
          style={{ borderRadius: 999 }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="size-4" strokeWidth={1.5} /> : <Moon className="size-4" strokeWidth={1.5} />}
        </button>
        <span className="nd-label px-3 py-1.5 border border-nd-border-visible" style={{ borderRadius: 999, fontSize: 11 }}>
          FEB 04 – FEB 11, 2024
        </span>
      </div>
    </motion.header>
  );
};

// ─────────────────────────────────────────────
// Shift Board (Operations Strip)
// ─────────────────────────────────────────────

const OperationsStrip = () => (
  <section className="border border-nd-border bg-nd-surface px-6 py-5" style={{ borderRadius: 12 }}>
    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:gap-8">
      {/* Left: heading + stats */}
      <div className="min-w-0 shrink-0">
        <p className="nd-label">FRONT OFFICE / MORNING SHIFT</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-nd-text-display">
          Shift Board
        </h2>

        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
          {operationsMeta.map((item) => (
            <div key={item.label}>
              <p className="nd-label">{item.label}</p>
              <p className="mt-0.5 font-mono text-sm font-bold text-nd-text-primary tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: action cards */}
      <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {hotelActions.map((action, i) => (
          <button
            key={action.title}
            type="button"
            className="nd-card-in group flex h-[88px] flex-col justify-between border border-nd-border bg-nd-black p-4 text-left transition-[colors,transform] duration-200 hover:scale-[1.03] hover:border-nd-text-disabled active:scale-[0.97]"
            style={{ borderRadius: 8, animationDelay: `${0.2 + i * 0.06}s` }}
          >
            <div className="flex items-start justify-between">
              <action.icon className="size-5 text-nd-text-secondary" strokeWidth={1.5} aria-hidden="true" />
              <ArrowUpRight className="size-3.5 text-nd-text-disabled transition-all duration-200 group-hover:text-nd-text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <span className="nd-label text-nd-text-primary" style={{ fontSize: 10 }}>{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// Availability Calendar
// ─────────────────────────────────────────────

function getAvailabilityStatus(year: number, month: number, day: number): AvailabilityStatus {
  const seasonalWeight = [0, 0, 1, 1, 2, 3, 3, 2, 2, 1, 0, 1][month];
  const weekendWeight = new Date(year, month, day).getDay();
  const score = ((day * 11 + month * 7 + (year % 100)) % 8) + seasonalWeight + (weekendWeight === 5 || weekendWeight === 6 ? 2 : 0);
  if (score >= 9) return "full";
  if (score >= 5) return "partial";
  return "available";
}

function generateAvailabilityMonthGrid(year: number, month: number, selectedDate: number): AvailabilityDateCell[] {
  const today = new Date();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const totalCells = firstDayOfMonth + daysInMonth <= 35 ? 35 : 42;
  const cells: AvailabilityDateCell[] = [];
  for (let i = 0; i < totalCells; i += 1) {
    const dayNumber = i - firstDayOfMonth + 1;
    let cellDate = dayNumber;
    let cellMonth = month;
    let cellYear = year;
    let isCurrentMonth = true;
    if (dayNumber <= 0) {
      cellDate = prevMonthDays + dayNumber;
      cellMonth = month === 0 ? 11 : month - 1;
      cellYear = month === 0 ? year - 1 : year;
      isCurrentMonth = false;
    } else if (dayNumber > daysInMonth) {
      cellDate = dayNumber - daysInMonth;
      cellMonth = month === 11 ? 0 : month + 1;
      cellYear = month === 11 ? year + 1 : year;
      isCurrentMonth = false;
    }
    cells.push({
      date: cellDate,
      month: cellMonth,
      year: cellYear,
      isCurrentMonth,
      isSelected: isCurrentMonth && cellDate === selectedDate,
      isToday: cellDate === today.getDate() && cellMonth === today.getMonth() && cellYear === today.getFullYear(),
      status: getAvailabilityStatus(cellYear, cellMonth, cellDate),
    });
  }
  return cells;
}

const calendarStatusStyles: Record<AvailabilityStatus, { swatch: string; cell: string; label: string }> = {
  available: {
    label: "Available",
    swatch: "border border-nd-border-visible",
    cell: "border border-nd-border-visible text-nd-text-secondary",
  },
  partial: {
    label: "Partial",
    swatch: "bg-nd-text-disabled",
    cell: "bg-nd-surface-raised text-nd-text-primary",
  },
  full: {
    label: "Full",
    swatch: "bg-nd-text-display",
    cell: "bg-nd-text-display text-nd-black",
  },
};

const AvailabilityCalendarPanel = () => {
  const [currentMonth, setCurrentMonth] = React.useState(5);
  const [currentYear, setCurrentYear] = React.useState(2025);
  const [selectedDate, setSelectedDate] = React.useState(18);

  const calendarCells = React.useMemo(
    () => generateAvailabilityMonthGrid(currentYear, currentMonth, selectedDate),
    [currentMonth, currentYear, selectedDate],
  );

  const selectedCell = React.useMemo(
    () => calendarCells.find((c) => c.isCurrentMonth && c.date === selectedDate) ?? calendarCells.find((c) => c.isCurrentMonth) ?? calendarCells[0],
    [calendarCells, selectedDate],
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
    setSelectedDate(1);
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
    setSelectedDate(1);
  };
  const handleDateSelect = (cell: AvailabilityDateCell) => {
    if (cell.month !== currentMonth || cell.year !== currentYear) {
      setCurrentMonth(cell.month);
      setCurrentYear(cell.year);
    }
    setSelectedDate(cell.date);
  };

  return (
    <div className="flex min-w-0 flex-col border border-nd-border bg-nd-surface xl:w-[400px] xl:shrink-0" style={{ borderRadius: 12 }}>
      <div className="flex flex-1 flex-col justify-between p-5">
        <p className="nd-label mb-4">ROOM AVAILABILITY</p>

        {/* Month nav — Nothing style: ← label → */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={handlePrevMonth} aria-label="Previous month" className="flex size-9 items-center justify-center border border-nd-border-visible text-nd-text-secondary transition-colors hover:text-nd-text-primary" style={{ borderRadius: 999 }}>
            <ChevronLeft className="size-4" strokeWidth={1.5} />
          </button>
          <span className="flex-1 text-center font-mono text-sm font-bold uppercase tracking-wider text-nd-text-primary">
            {MONTH_LABELS[currentMonth]} {currentYear}
          </span>
          <button type="button" onClick={handleNextMonth} aria-label="Next month" className="flex size-9 items-center justify-center border border-nd-border-visible text-nd-text-secondary transition-colors hover:text-nd-text-primary" style={{ borderRadius: 999 }}>
            <ChevronRight className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mx-auto mt-5 w-full max-w-[360px] flex-1">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="nd-label py-1.5" style={{ fontSize: 9 }}>{label}</span>
            ))}
          </div>

          {/* Date grid */}
          <div className="mt-2 grid grid-cols-7 gap-2">
            {calendarCells.map((cell, i) => {
              const style = calendarStatusStyles[cell.status];
              return (
                <button
                  key={`${cell.year}-${cell.month}-${cell.date}`}
                  type="button"
                  onClick={() => handleDateSelect(cell)}
                  className={cn(
                    "nd-cal-cell relative flex aspect-square items-center justify-center font-mono text-[11px] font-medium transition-[colors,transform] duration-150 hover:scale-110 active:scale-90",
                    !cell.isCurrentMonth && "text-nd-text-disabled/30",
                    cell.isCurrentMonth && style.cell,
                    cell.isSelected && "ring-1 ring-nd-accent ring-offset-1 ring-offset-nd-black",
                  )}
                  style={{ borderRadius: 4, animationDelay: `${0.15 + i * 0.012}s` }}
                >
                  {cell.date}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {(["available", "partial", "full"] as AvailabilityStatus[]).map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className={cn("size-2", calendarStatusStyles[status].swatch)} style={{ borderRadius: 1 }} />
                  <span className="nd-label" style={{ fontSize: 9 }}>{calendarStatusStyles[status].label}</span>
                </div>
              ))}
            </div>
            <span className="nd-label" style={{ fontSize: 9 }}>
              {selectedCell.date} {MONTH_LABELS[selectedCell.month].slice(0, 3).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Revenue Flow Chart
// ─────────────────────────────────────────────

// Monthly aggregated data for the bar chart
function createMonthlyBookingData() {
  return salesTrendMonths.map((month, i) => ({
    month: month.label,
    direct: directBookingPeaks[i],
    ota: otaBookingPeaks[i],
  }));
}

function BookingTooltipContent(props: TooltipProps<number, string>) {
  const nd = useND();
  const { active, payload } = props as { active?: boolean; payload?: Array<{ payload?: { month: string; direct: number; ota: number }; dataKey?: string; value?: number }> };
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="min-w-[140px] border border-nd-border-visible bg-nd-surface p-3" style={{ borderRadius: 4 }}>
      <p className="nd-label mb-2">{row.month} 2025</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="nd-label flex items-center gap-1.5">
            <span className="inline-block size-1.5" style={{ background: nd.textDisplay }} />
            DIRECT
          </span>
          <span className="font-mono text-xs font-bold text-nd-text-display tabular-nums">{row.direct}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="nd-label flex items-center gap-1.5">
            <span className="inline-block size-1.5" style={{ background: nd.borderVisible }} />
            OTA
          </span>
          <span className="font-mono text-xs font-bold text-nd-text-primary tabular-nums">{row.ota}</span>
        </div>
      </div>
    </div>
  );
}

const RevenueFlowChart = () => {
  const nd = useND();
  const monthlyData = React.useMemo(() => createMonthlyBookingData(), []);

  const bookingMix = React.useMemo(() => {
    const totals = monthlyData.reduce((acc, m) => { acc.direct += m.direct; acc.ota += m.ota; return acc; }, { direct: 0, ota: 0 });
    const total = totals.direct + totals.ota;
    return {
      ...totals,
      directShare: total > 0 ? Math.round((totals.direct / total) * 100) : 0,
      otaShare: total > 0 ? Math.round((totals.ota / total) * 100) : 0,
      total,
    };
  }, [monthlyData]);

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden border border-nd-border bg-nd-surface px-5 pt-4 pb-3" style={{ borderRadius: 12 }}>
      <div className="mb-2 shrink-0">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <div>
            <p className="nd-label">BOOKING SOURCES</p>
            <div className="mt-1 flex flex-wrap items-end gap-3">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                className="text-4xl leading-none font-bold text-nd-text-display tabular-nums"
                style={{ fontFamily: "Doto, 'Space Mono', monospace" }}
              >
                {numberFormatter.format(bookingMix.total)}
              </motion.span>
              <span className="nd-label mb-0.5">RESERVATIONS</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="inline-block size-1.5" style={{ background: nd.textDisplay }} />
              <span className="nd-label">DIRECT</span>
              <span className="font-mono text-xs font-bold text-nd-text-primary tabular-nums">{numberFormatter.format(bookingMix.direct)}</span>
              <span className="nd-label">{bookingMix.directShare}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block size-1.5" style={{ background: nd.borderVisible }} />
              <span className="nd-label">OTA</span>
              <span className="font-mono text-xs font-bold text-nd-text-primary tabular-nums">{numberFormatter.format(bookingMix.ota)}</span>
              <span className="nd-label">{bookingMix.otaShare}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 w-full min-w-0">
        <ChartContainer
          config={{ direct: { label: "Direct", color: nd.textDisplay }, ota: { label: "OTA", color: nd.borderVisible } }}
          className="h-full w-full [&_.recharts-cartesian-axis-line]:stroke-transparent [&_.recharts-cartesian-axis-tick_line]:stroke-transparent"
        >
          <BarChart
            data={monthlyData}
            margin={{ top: 4, right: 4, left: -8, bottom: 16 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontFamily: "'Space Mono', monospace", fill: nd.textSecondary }}
              dy={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontFamily: "'Space Mono', monospace", fill: nd.textDisabled }}
              width={32}
            />
            <Tooltip content={<BookingTooltipContent />} cursor={{ fill: nd.surface, radius: 2 }} />
            <Bar dataKey="direct" stackId="bookings" fill={nd.textDisplay} radius={[0, 0, 0, 0]} />
            <Bar dataKey="ota" stackId="bookings" fill={nd.borderVisible} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Arrivals Table
// ─────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  accent: "text-nd-accent",
  success: "text-nd-success",
  warning: "text-nd-warning",
};

const SOURCE_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Direct: Globe,
  "Booking.com": Globe,
  Expedia: Globe,
  "Walk-in": DoorOpen,
};

function parseCheckInTimeToMinutes(label: string) {
  const matched = label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!matched) return Number.MAX_SAFE_INTEGER;
  const [, hourValue, minuteValue, period] = matched;
  const hour = Number(hourValue) % 12;
  const minute = Number(minuteValue);
  const isPm = period.toUpperCase() === "PM";
  return (isPm ? hour + 12 : hour) * 60 + minute;
}

const RecentArrivalsTableCard = () => {
  const arrivals = React.useMemo(
    () => [...RECENT_ARRIVALS_TABLE].sort((a, b) => parseCheckInTimeToMinutes(a.time) - parseCheckInTimeToMinutes(b.time)),
    [],
  );

  return (
    <div className="border border-nd-border bg-nd-surface" style={{ borderRadius: 12 }}>
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-3">
          <span className="nd-label text-nd-text-display" style={{ fontSize: 12 }}>RECENT ARRIVALS</span>
          <span className="font-mono text-xs font-bold text-nd-text-secondary tabular-nums">{arrivals.length}</span>
        </div>
        <button type="button" className="nd-label text-nd-text-secondary transition-colors hover:text-nd-text-primary" style={{ fontSize: 10 }}>
          VIEW ALL
        </button>
      </div>

      <div className="mt-4 border-t border-nd-border">
        <ScrollArea className="h-[460px]">
          <div className="min-w-[940px]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-nd-border-visible hover:bg-transparent">
                  <TableHead className="nd-label h-9 w-[70px] px-4" style={{ fontSize: 9 }}>R. NO</TableHead>
                  <TableHead className="nd-label h-9 w-[220px] px-4" style={{ fontSize: 9 }}>GUEST</TableHead>
                  <TableHead className="nd-label h-9 w-[140px] px-4" style={{ fontSize: 9 }}>ROOM</TableHead>
                  <TableHead className="nd-label h-9 w-[100px] px-4" style={{ fontSize: 9 }}>CHECK-IN</TableHead>
                  <TableHead className="nd-label h-9 w-[70px] px-4 text-right" style={{ fontSize: 9 }}>NIGHTS</TableHead>
                  <TableHead className="nd-label h-9 w-[70px] px-4 text-right" style={{ fontSize: 9 }}>GUESTS</TableHead>
                  <TableHead className="nd-label h-9 w-[120px] px-4" style={{ fontSize: 9 }}>SOURCE</TableHead>
                  <TableHead className="nd-label h-9 w-[100px] px-4" style={{ fontSize: 9 }}>STATUS</TableHead>
                  <TableHead className="nd-label h-9 w-[200px] px-4" style={{ fontSize: 9 }}>REQUESTS</TableHead>
                  <TableHead className="nd-label h-9 w-[56px] px-4 text-right" style={{ fontSize: 9 }}></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {arrivals.map((arrival, index) => {
                  const SourceIcon = SOURCE_ICONS[arrival.source] || Globe;
                  const leadGuest = arrival.guests[0];
                  const isVip = arrival.statusColor === "accent";

                  return (
                    <tr
                      key={arrival.id}
                      className={cn(
                        "nd-row-in h-12 border-b border-nd-border transition-colors hover:bg-nd-surface-raised",
                        isVip && "border-l-2 border-l-nd-accent",
                      )}
                      style={{ animationDelay: `${0.3 + index * 0.04}s` }}
                    >
                      <TableCell className="px-4 font-mono text-xs text-nd-text-disabled tabular-nums">
                        {105 + index}
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-6" style={{ borderRadius: 4 }}>
                            <AvatarImage src={leadGuest?.avatar} alt={arrival.guestName} />
                            <AvatarFallback style={{ borderRadius: 4 }} className="bg-nd-surface-raised text-[8px] text-nd-text-secondary">
                              {leadGuest?.initials ?? arrival.guestName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="max-w-[160px] truncate text-sm text-nd-text-primary">{arrival.guestName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs text-nd-text-secondary">
                        {arrival.roomType} <span className="text-nd-text-primary">{arrival.roomNumber}</span>
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs text-nd-text-secondary tabular-nums">
                        {arrival.time.replace(" Check-in", "")}
                      </TableCell>
                      <TableCell className="px-4 text-right font-mono text-xs text-nd-text-primary tabular-nums">
                        {arrival.nights}
                      </TableCell>
                      <TableCell className="px-4 text-right font-mono text-xs text-nd-text-primary tabular-nums">
                        {arrival.guestCount}
                      </TableCell>
                      <TableCell className="px-4">
                        <span className="inline-flex items-center gap-1.5 text-nd-text-secondary">
                          <SourceIcon className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                          <span className="font-mono text-xs">{arrival.source}</span>
                        </span>
                      </TableCell>
                      <TableCell className="px-4">
                        <span className={cn("nd-label font-bold", STATUS_STYLES[arrival.statusColor] || "text-nd-text-secondary")} style={{ fontSize: 10 }}>
                          {arrival.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] px-4 text-xs text-nd-text-disabled">
                        <span className="block truncate" title={arrival.specialRequests?.trim() || "—"}>
                          {arrival.specialRequests?.trim() || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        <button type="button" className="flex size-7 items-center justify-center text-nd-text-disabled transition-colors hover:text-nd-text-primary" aria-label={`More actions for ${arrival.guestName}`}>
                          <MoreHorizontal className="size-3.5" strokeWidth={1.5} />
                        </button>
                      </TableCell>
                    </tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Dashboard Layout
// ─────────────────────────────────────────────

const BookingCalendarRow = () => {
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const chartWrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const cal = calendarRef.current;
    const chart = chartWrapperRef.current;
    if (!cal || !chart) return;
    const sync = () => {
      const h = cal.scrollHeight;
      if (h > 0) chart.style.height = `${h}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(cal);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div ref={chartWrapperRef} className="min-w-0 flex-1 overflow-hidden [&>*]:h-full">
        <RevenueFlowChart />
      </div>
      <div ref={calendarRef}>
        <AvailabilityCalendarPanel />
      </div>
    </div>
  );
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const DashboardContent = () => (
  <main id="dashboard-main" tabIndex={-1} className="w-full flex-1 space-y-6 overflow-auto bg-nd-black p-6">
    <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={0}>
      <OperationsStrip />
    </motion.div>
    <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={1}>
      <BookingCalendarRow />
    </motion.div>
    <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={2}>
      <RecentArrivalsTableCard />
    </motion.div>
  </main>
);

const Dashboard18 = ({ className }: { className?: string }) => {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  const toggle = React.useCallback(() => {
    const next = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as any).startViewTransition(next);
    } else {
      next();
    }
  }, []);
  const nd = theme === "dark" ? ND_DARK : ND_LIGHT;

  // Keep the mutable ND in sync
  React.useEffect(() => { ND = nd; }, [nd]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, nd }}>
      <div className={theme === "light" ? "light" : ""}>
        <SidebarProvider className={cn("bg-nd-black", className)}>
          <a href="#dashboard-main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-nd-surface focus:px-3 focus:py-2 focus:text-sm focus:text-nd-text-primary focus:ring-1 focus:ring-nd-border-visible" style={{ borderRadius: 4 }}>
            Skip to main content
          </a>
          <AppSidebar />
          <div className="h-svh w-full overflow-hidden lg:p-2">
            <div className="flex h-full w-full flex-col items-center justify-start overflow-hidden bg-nd-black lg:border lg:border-nd-border" style={{ borderRadius: 12 }}>
              <DashboardHeader />
              <DashboardContent />
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ThemeContext.Provider>
  );
};

export { Dashboard18 };
