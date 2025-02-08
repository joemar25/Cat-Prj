import {
    AlertTriangle,
    ArrowRight,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Command,
    CreditCard,
    File,
    FileText,
    HelpCircle,
    Image,
    Laptop,
    Loader2,
    Mail,
    MapPin,
    Moon,
    MoreVertical,
    Pizza,
    Plus,
    RefreshCwIcon,
    Settings,
    SunMedium,
    Trash,
    Twitter,
    User,
    Printer,
    BadgeCheck,
    Bell,
    LogOut,
    Receipt,
    X,
    RotateCcw,
    CalendarIcon,
    Tag,
    Shield,
    Folder,
    MoreHorizontal,
    Share,
    Trash2,
    RadioReceiverIcon,
    PanelLeft,
    Lightbulb,
    ChevronsUpDown,
    Files,
    Frame,
    LayoutDashboard,
    LeafyGreen,
    LifeBuoy,
    PieChart,
    Send,
    User2,
    Building,
    LucideSend,
    LucidePenLine,
    Hash,
    UserCheck,
    MessageSquare,
    CalendarClock,
    SearchIcon,
    Briefcase,
    UserCog,
    Minus,
    Clipboard,
    QrCode,
    Barcode,
    Download,
    View,
    Baby,
    Skull,
    Save,
    Eye,
    EyeOff,
    Key,
    Clock,
    Cross,
    Scan,
    Home,
    UserPlus,
    Cake,
    Gem,
    NotebookText,
    ChartArea,
    UploadIcon,
    Camera,
    LogOutIcon,
    Pencil,
    Archive,
    // mar-note: this commented is not to be used, but please do not remove
    // type Icon as LucideIcon,
} from 'lucide-react'

import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CircleIcon,
    Cross2Icon,
    DotsHorizontalIcon,
    InfoCircledIcon,
    StopwatchIcon,
    HeartFilledIcon,
} from '@radix-ui/react-icons'

export type Icon = typeof X

export const Icons = {
    logo: Command,
    close: X,
    spinner: Loader2,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    trash: Trash,
    post: FileText,
    page: File,
    media: Image,
    settings: Settings,
    billing: CreditCard,
    ellipsis: MoreVertical,
    add: Plus,
    edit: Minus,
    warning: AlertTriangle,
    user: User,
    arrowRight: ArrowRight,
    help: HelpCircle,
    pizza: Pizza,
    sun: SunMedium,
    moon: Moon,
    laptop: Laptop,
    twitter: Twitter,
    check: Check,
    calendar: Calendar,
    refresh: RefreshCwIcon,
    mapPin: MapPin,
    mail: Mail,
    printer: Printer,
    badgeCheck: BadgeCheck,
    bell: Bell,
    logout: LogOut,
    reciept: Receipt,
    calendarIcon: CalendarIcon,
    rotateCcw: RotateCcw,
    fileText: FileText,
    tag: Tag,
    shield: Shield,
    folder: Folder,
    moreHorizontal: MoreHorizontal,
    share: Share,
    trash2: Trash2,
    radioReceiverIcon: RadioReceiverIcon,
    arrowDownIcon: ArrowDownIcon,
    arrowRightIcon: ArrowRightIcon,
    arrowUpIcon: ArrowUpIcon,
    circleIcon: CircleIcon,
    infoCircledIcon: InfoCircledIcon,
    stopwatchIcon: StopwatchIcon,
    panelLeft: PanelLeft,
    lightBulb: Lightbulb,
    moonIcon: Moon,
    chevronsUpDown: ChevronsUpDown,
    file: File,
    files: Files,
    frame: Frame,
    layoutDashboard: LayoutDashboard,
    leafyGreen: LeafyGreen,
    lifeBuoy: LifeBuoy,
    map: Map,
    pieChart: PieChart,
    send: Send,
    user2: User2,
    building: Building,
    helpCircle: HelpCircle,
    lucideSend: LucideSend,
    lucidePenLine: LucidePenLine,
    hash: Hash,
    userCheck: UserCheck,
    messageSquare: MessageSquare,
    calendarClock: CalendarClock,
    search: SearchIcon,
    cross2Icon: Cross2Icon,
    briefcase: Briefcase,
    userCog: UserCog,
    clipboard: Clipboard,
    QrCode: QrCode,
    Barcode: Barcode,
    download: Download,
    plus: Plus,
    view: View,
    horizontalThreeDots: DotsHorizontalIcon,
    heart: HeartFilledIcon,
    baby: Baby,
    skull: Skull,
    save: Save,
    eye: Eye,
    eyeOff: EyeOff,
    key: Key,
    clock: Clock,
    x: Cross,
    scan: Scan,
    home: Home,
    userPlus: UserPlus,
    cake: Cake,
    gem: Gem,
    notebookText: NotebookText,
    report: ChartArea,
    more: MoreHorizontal,
    upload: UploadIcon,
    camera: Camera,
    pencil: Pencil,
    archive: Archive,
    gear: Settings,
} as const

export type IconsType = typeof Icons
