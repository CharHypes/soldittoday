"use client";

import { useState } from "react";
import { addTask, addListingTask, toggleTask, deleteTask } from "@/app/dashboard/actions";

export type Task = {
  id: string; title: string; due_date: string | null; assignee: string | null;
  done: boolean; done_at: string | null; created_at: string;
};

const AV = ["#6c5767", "#5a6170", "#6f5a5f", "#4d6368", "#66605a", "#4a4448"];
const initials = (s: string) => s.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
const hueOf = (s: string) => AV[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AV.length];
const today = () => new Date().toISOString().slice(0, 10);
const dueFmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function TasksPanel({ txId, listingId, tasks }: { txId?: string; listingId?: string; tasks: Task[] }) {
  const [adding, setAdding] = useState(false);
  const open = tasks.filter((t) => !t.done).length;
  const done = tasks.length - open;
  const inp = "inp";
  const addAction = listingId ? addListingTask : addTask;
  const ParentInput = () =>
    listingId ? <input type="hidden" name="listing_id" value={listingId} /> : <input type="hidden" name="transaction_id" value={txId ?? ""} />;

  return (
    <div className="panel">
      <div className="clhead">
        <div className="clmeta"><b>{open}</b> open · {done} done</div>
        <button type="button" className="btn mauve" onClick={() => setAdding((v) => !v)}>
          <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13 }}><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg> Add task
        </button>
      </div>

      {adding && (
        <form action={addAction} className="card" style={{ padding: 14, marginBottom: 14 }}
          onSubmit={() => setTimeout(() => setAdding(false), 0)}>
          <ParentInput />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 150px auto", gap: 10, alignItems: "end" }}>
            <label className="ci"><span className="k">Task</span><input className={inp} name="title" required placeholder="e.g. Order the appraisal" autoFocus /></label>
            <label className="ci"><span className="k">Due</span><input className={inp} type="date" name="due_date" /></label>
            <label className="ci"><span className="k">Assignee</span><input className={inp} name="assignee" placeholder="Name" /></label>
            <button type="submit" className="btn mauve">Add</button>
          </div>
        </form>
      )}

      {tasks.length === 0 && !adding && <p className="emptynote">No tasks yet. Add the first one to start tracking this deal&rsquo;s to-dos.</p>}

      {tasks.length > 0 && (
        <div className="cl">
          {tasks.map((t) => {
            const overdue = !t.done && t.due_date && t.due_date < today();
            return (
              <div key={t.id} className="clrow" style={{ gridTemplateColumns: "26px minmax(0,1fr) 92px 30px 26px" }}>
                <form action={toggleTask} style={{ display: "contents" }}>
                  <input type="hidden" name="id" value={t.id} />
                  <ParentInput />
                  <input type="checkbox" className="cbx" defaultChecked={t.done} onChange={(e) => e.currentTarget.form?.requestSubmit()} aria-label={t.title} />
                </form>
                <span className={`doc${t.done ? " is-done" : ""}`}>{t.title}</span>
                <span style={{ fontSize: 12.5, textAlign: "right", color: overdue ? "var(--red)" : "var(--ink3)", fontWeight: overdue ? 700 : 400 }}>
                  {t.due_date ? dueFmt(t.due_date) : ""}
                </span>
                {t.assignee
                  ? <span className="av" style={{ width: 26, height: 26, fontSize: 10, background: hueOf(t.assignee), color: "#fff", justifySelf: "center" }}>{initials(t.assignee)}</span>
                  : <span />}
                <form action={deleteTask} style={{ justifySelf: "center" }}>
                  <input type="hidden" name="id" value={t.id} />
                  <ParentInput />
                  <button type="submit" className="fn-x" aria-label="Delete task">×</button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
