import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

import commentsData from "../../data/comments.json";
import productsData from "../../data/products.json";
import salesData from "../../data/sales.json";
import usersData from "../../data/users.json";

type User = {
  id: string;
  name: string;
  avatar?: string;
  type?: string;
};

type Product = {
  id: string;
  name: string;
  vendor?: string;
  price?: number;
};

type RawComment = {
  id: string;
  productId: string;
  userId: string;
  rating?: number;
  content: string;
  createdAt: string;
};

type RawSale = {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  status?: string;
};

type Noti = {
  id: string;
  type: "sale" | "comment";
  createdAt: string;
  user: User | null;
  product: Product | null;
  message: string;
  refId?: string;
};

const READ_KEY = "komorebi_notis_read";

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [notis, setNotis] = useState<Noti[]>([]);
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Build notifications from sales + comments
  useEffect(() => {
    const products: Product[] = (productsData as any) ?? [];
    const users: User[] = (usersData as any) ?? [];
    const comments: RawComment[] = (commentsData as any) ?? [];
    const sales: RawSale[] = (salesData as any) ?? [];

    const salesNotis: Noti[] = sales.map((s) => {
      const buyer = users.find((u) => u.id === s.buyerId) ?? null;
      const product = products.find((p) => p.id === s.productId) ?? null;
      return {
        id: `sale_${s.id}`,
        type: "sale",
        createdAt: s.createdAt,
        user: buyer,
        product,
        message: `${buyer?.name ?? "Someone"} purchased ${product?.name ?? "a product"} (x${s.quantity})`,
        refId: s.id,
      };
    });

    const commentsNotis: Noti[] = comments.map((c) => {
      const author = users.find((u) => u.id === c.userId) ?? null;
      const product = products.find((p) => p.id === c.productId) ?? null;
      // Shorten comment for message
      const snippet = c.content.length > 70 ? c.content.slice(0, 67) + "..." : c.content;
      return {
        id: `comment_${c.id}`,
        type: "comment",
        createdAt: c.createdAt,
        user: author,
        product,
        message: `${author?.name ?? "Someone"} commented: "${snippet}"`,
        refId: c.id,
      };
    });

    const combined = [...salesNotis, ...commentsNotis].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setNotis(combined.slice(0, 10));
  }, []);

  // Load readMap from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(READ_KEY);
      if (raw) setReadMap(JSON.parse(raw));
    } catch {
      setReadMap({});
    }
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Mark single as read
  const markRead = (id: string) => {
    const next = { ...readMap, [id]: true };
    setReadMap(next);
    localStorage.setItem(READ_KEY, JSON.stringify(next));
  };

  // Mark all as read
  const markAllRead = () => {
    const next: Record<string, boolean> = {};
    notis.forEach((n) => (next[n.id] = true));
    setReadMap(next);
    localStorage.setItem(READ_KEY, JSON.stringify(next));
  };

  // How many unread
  const unreadCount = notis.reduce((acc, n) => (readMap[n.id] ? acc : acc + 1), 0);

  return (
    <div className="relative relative inline-flex items-center" ref={wrapperRef}>
      {/* Bell button */}
      <button
  aria-label="Open notifications"
  onClick={() => setOpen((v) => !v)}
  className="relative inline-flex items-center justify-center h-6 w-6"
>
  <Bell
    size={22}
    className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
  />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full text-xs text-white bg-[var(--komorebi-yellow)] font-medium">
      {unreadCount}
    </span>
  )}
</button>


      {/* Dropdown */}
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute top-full right-0 mt-3 w-80 max-w-sm z-50"
        >
          {/* Glass card */}
          <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-3xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Notifications</h4>
                <button
                  onClick={markAllRead}
                  className="text-sm text-[var(--komorebi-black)]/70 hover:text-[var(--komorebi-black)]"
                >
                  Mark all read
                </button>
              </div>
            </div>

            <ul className="max-h-72 overflow-auto notifications-list">
              {notis.length === 0 && (
                <li className="p-3 text-sm text-[var(--komorebi-black)]/60">No notifications</li>
              )}
              {notis.map((n) => {
                const isRead = !!readMap[n.id];
                return (
                  <li
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 items-start hover:bg-white/10 transition-colors ${
                      isRead ? "opacity-70" : "bg-white/5"
                    }`}
                  >
                    {/* Left icon by type */}
                    <div className="flex-shrink-0 mt-1">
                      {n.type === "sale" ? (
                        <span className="inline-block bg-[var(--komorebi-yellow)] rounded p-1 text-sm">💳</span>
                      ) : (
                        <span className="inline-block bg-[var(--komorebi-yellow)] rounded p-1 text-sm">💬</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-[var(--komorebi-black)]">
                          {n.user?.name ?? "Unknown"}
                          <span className="ml-2 text-xs font-normal text-[var(--komorebi-black)]/60">• {n.product?.name ?? ""}</span>
                        </div>
                        <div className="text-xs text-[var(--komorebi-black)]/60">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="mt-1 text-sm text-[var(--komorebi-black)]/80">
                        {n.message}
                      </div>

                      <div className="mt-2 flex items-center gap-3">
                        {!isRead && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="text-xs px-2 py-1 rounded-full bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)]"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => {
                            // Example action: navigate to product page (if you want)
                            // window.location.href = `/product/${n.product?.id ?? ""}`;
                            setOpen(false);
                            markRead(n.id);
                          }}
                          className="text-xs text-[var(--komorebi-black)]/70 hover:text-[var(--komorebi-black)]"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="px-4 py-3 border-t border-white/10">
              <button
                onClick={() => {
                  // Example action: go to full notifications page
                  // navigate('/notifications') if you use react-router here
                  setOpen(false);
                }}
                className="w-full py-2 rounded-full bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] font-medium"
              >
                View All Notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
