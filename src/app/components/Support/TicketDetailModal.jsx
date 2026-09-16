"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiMail, FiX } from "react-icons/fi";

function MetaCard({ label, children, wide = false }) {
  if (children == null || children === "") return null;
  return (
    <div className={`ticket-detail-meta${wide ? " ticket-detail-meta--wide" : ""}`}>
      <span className="ticket-detail-meta__label">{label}</span>
      <div className="ticket-detail-meta__value">{children}</div>
    </div>
  );
}

function statusBadgeClass(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("resolved")) return "badge badge-active";
  if (s.includes("progress")) return "badge badge-brand";
  if (s.includes("hold")) return "badge badge-neutral";
  if (s.includes("active")) return "badge badge-info";
  return "badge badge-neutral";
}

/**
 * Premium support ticket details overlay.
 */
export default function TicketDetailModal({ open, ticket, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !ticket || !mounted) return null;

  const replies = Array.isArray(ticket.replies) ? ticket.replies : [];

  return createPortal(
    <div
      className="ticket-detail-mask"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="ticket-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="ticket-detail-hero">
          <div className="ticket-detail-hero__glow" aria-hidden />
          <button
            type="button"
            className="ticket-detail-close"
            aria-label="Close"
            onClick={onClose}
          >
            <FiX size={16} />
          </button>
          <p className="ticket-detail-kicker">Support ticket</p>
          <h2 id="ticket-detail-title" className="ticket-detail-title">
            {ticket.subject || "Untitled ticket"}
          </h2>
          <div className="ticket-detail-hero__meta">
            <span className={statusBadgeClass(ticket.status)}>
              {ticket.status || "Unknown"}
            </span>
            {ticket.email ? (
              <span className="ticket-detail-email">
                <FiMail size={14} aria-hidden />
                {ticket.email}
              </span>
            ) : null}
          </div>
        </header>

        <div className="ticket-detail-body">
          <div className="ticket-detail-grid">
            <MetaCard label="Ticket ID" wide>
              <span className="ticket-detail-id">{ticket.id}</span>
            </MetaCard>
            <MetaCard label="Email">{ticket.email}</MetaCard>
            <MetaCard label="Status">
              <span className={statusBadgeClass(ticket.status)}>
                {ticket.status || "Unknown"}
              </span>
            </MetaCard>
            <MetaCard label="Submit date">{ticket.created_at}</MetaCard>
            <MetaCard label="Last updated">{ticket.updated_at}</MetaCard>
            <MetaCard label="Description" wide>
              {ticket.description}
            </MetaCard>
          </div>

          <section className="ticket-detail-replies">
            <div className="ticket-detail-replies__head">
              <h3 className="ticket-detail-replies__title">Replies</h3>
              <span className="ticket-detail-replies__count">
                {replies.length}
              </span>
            </div>

            {replies.length === 0 ? (
              <p className="ticket-detail-replies__empty">
                No replies yet on this ticket.
              </p>
            ) : (
              <ul className="ticket-detail-replies__list">
                {replies.map((reply) => (
                  <li
                    key={reply.id || `${reply.author_name}-${reply.created_at}`}
                    className="ticket-detail-reply"
                  >
                    <div className="ticket-detail-reply__avatar" aria-hidden>
                      {String(reply.author_name || reply.author_type || "A")
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="ticket-detail-reply__content">
                      <div className="ticket-detail-reply__meta">
                        <span className="ticket-detail-reply__author">
                          {reply.author_type || "User"}
                          {reply.author_name ? ` · ${reply.author_name}` : ""}
                        </span>
                        {reply.created_at ? (
                          <span className="ticket-detail-reply__time">
                            {reply.created_at}
                          </span>
                        ) : null}
                      </div>
                      <p className="ticket-detail-reply__message">
                        {reply.message}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
