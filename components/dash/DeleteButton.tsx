"use client";

/** A delete control that asks for confirmation before running the server action. */
export default function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmText = "Delete this? This can't be undone.",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-sm font-medium text-red-300 transition-colors hover:border-red-500/50 hover:text-red-200"
      >
        {label}
      </button>
    </form>
  );
}
