import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [notis, setNotis] = useState<Noti[]>([]);
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(READ_KEY);
      if (raw) setReadMap(JSON.parse(raw));
    } catch {
      setReadMap({});
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const compute = () => {
      const btn = buttonRef.current;
      if (!btn) return setCoords(null);
      const rect = btn.getBoundingClientRect();
      const top = rect.bottom + 12 + window.scrollY;
      const left = rect.right - 320 - 16 + window.scrollX;
      setCoords({ top, left });
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, { passive: true });
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute);
    };
  }, [open]);

  const markRead = (id: string) => {
    const next = { ...readMap, [id]: true };
    setReadMap(next);
    localStorage.setItem(READ_KEY, JSON.stringify(next));
  };

  const markAllRead = () => {
    const next: Record<string, boolean> = {};
    notis.forEach((n) => (next[n.id] = true));
    setReadMap(next);
    localStorage.setItem(READ_KEY, JSON.stringify(next));
  };

  const unreadCount = notis.reduce((acc, n) => (readMap[n.id] ? acc : acc + 1), 0);

  return (
    <div className="relative inline-flex items-center" ref={wrapperRef}>
      <button
        ref={buttonRef}
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

      {open && coords &&
        createPortal(
          <div
            role="dialog"
            aria-label="Notifications"
            style={{ position: "absolute", top: coords.top, left: coords.left }}
            className="w-80 max-w-sm z-[9999]"
          >
            <div className="bg-white/75 border backdrop-blur-sm border-white/10 shadow-xl rounded-3xl overflow-hidden">
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
                        isRead ? "opacity-80" : "bg-white/10"
                      }`}
                    >
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

                        <div className="mt-1 text-sm text-[var(--komorebi-black)]/90">
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
                  onClick={() => setOpen(false)}
                  className="w-full py-2 rounded-full bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] font-medium"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
