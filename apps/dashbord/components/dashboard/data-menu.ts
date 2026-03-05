import {
  IconCloudComputing,
  IconDashboard,
  IconListDetails,
  IconReport
} from "@tabler/icons-react";
import { BoxIcon, Frame, File as FileIcon } from "lucide-react";

export const dataMenus = {
  brand: {
    name: "DTM",
    icon: Frame,
    version: "1.0.0"
  },
  menus: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard
    },
    {
      title: "Incoming Document",
      url: "/dashboard/incoming-document",
      icon: IconCloudComputing
    },
    {
      title: "Report",
      url: "/dashboard/report",
      icon: IconReport
    }
  ],
  menuData: [
    {
      title: "Master Data",
      url: "#",
      icon: IconListDetails,
      items: [
        {
          title: "Document Type",
          url: "/dashboard/master-data/document-type"
        },
        {
          title: "Silo",
          url: "/dashboard/master-data/silo"
        },
        {
          title: "Sender",
          url: "/dashboard/master-data/sender"
        },
        {
          title: "Vendor",
          url: "/dashboard/master-data/vendor"
        },
        {
          title: "Bank",
          url: "/dashboard/master-data/bank"
        },
        {
          title: "User",
          url: "/dashboard/master-data/user"
        }
      ]
    },
    {
      title: "Incoming Document",
      url: "#",
      icon: IconCloudComputing,
      items: [
        {
          title: "Invoice",
          url: "#"
        },
        {
          title: "Delivery Order",
          url: "#"
        },
        {
          title: "Packing List",
          url: "#"
        },
        {
          title: "Voucher Payment",
          url: "#"
        }
      ]
    },
    {
      title: "Saviing Document Box",
      url: "#",
      icon: BoxIcon,
      items: [
        {
          title: "Invoice",
          url: "#"
        },
        {
          title: "Delivery Order",
          url: "#"
        },
        {
          title: "Packing List",
          url: "#"
        },
        {
          title: "Voucher Payment",
          url: "#"
        }
      ]
    }
  ],
  documents: [
    {
      name: "Invoice",
      url: "#",
      icon: FileIcon
    },
    {
      name: "Delivery Order",
      url: "#",
      icon: FileIcon
    },
    {
      name: "Packing List",
      url: "#",
      icon: FileIcon
    },
    {
      name: "Voucher Payment",
      url: "#",
      icon: FileIcon
    }
  ]
};
