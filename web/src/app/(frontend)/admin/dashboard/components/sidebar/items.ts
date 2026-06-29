import { 
  ChartColumnIncreasing, 
  LibraryBig,
  Lock
} from "lucide-react";

const baseUrl = '/admin/dashboard';

export const items = [
  {
    title: "Início",
    url: baseUrl,
    icon: ChartColumnIncreasing,
  },
  {
    marginTop: true,
    title: "Blogs",
    url: `${baseUrl}/blogs`,
    icon: LibraryBig,
  },
  {
    title: "Admins",
    url: `${baseUrl}/admins`,
    icon: Lock,
  },
]