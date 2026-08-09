import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Link2, CheckCircle2, AlertCircle } from "lucide-react";
import { CATEGORIES } from "@/data/games";

const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLScq5NKt3VTwtOFvN-2uKeyqfwyqMIMf3WMZo_Ij-8C2HRSQPg/formResponse";

// Google Form field entry IDs
const ENTRY = {
  groupName: "entry.1548349999",
  driveLink: "entry.1115536100",
  gameName: "entry.1261181719",
  description: "entry.1642093413",
};

type Status = "idle" | "loading" | "success" | "error";

export function UploadSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [gameName, setGameName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [description, setDesc] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!gameName.trim()) e.gameName = "Game name is required";
    if (!groupName.trim()) e.groupName = "Developer / group name is required";
    if (!driveLink.trim()) e.driveLink = "Google Drive link is required";
    else if (!driveLink.startsWith("http")) e.driveLink = "Enter a valid URL";
    if (!description.trim()) e.description = "Description is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");

    // Build the full description string that includes category
    const fullDescription = `${description.trim()}, ${category}`;

    const body = new FormData();
    body.append(ENTRY.gameName, gameName.trim());
    body.append(ENTRY.groupName, groupName.trim());
    body.append(ENTRY.driveLink, driveLink.trim());
    body.append(ENTRY.description, fullDescription);

    try {
      // no-cors: we can't read the response but the data IS submitted
      await fetch(FORM_ACTION, { method: "POST", body, mode: "no-cors" });
      setStatus("success");
      setGameName("");
      setGroupName("");
      setDriveLink("");
      setDesc("");
      setCategory(CATEGORIES[0]);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="upload" className="relative py-24">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.55 0.28 305 / 0.18), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-xl px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="mx-auto mb-6 size-20 text-green-400" strokeWidth={1.5} />
            <h2 className="text-3xl font-bold">Game Submitted!</h2>
            <p className="mt-3 text-muted-foreground">
              Thank you! Your game has been submitted for review. It will appear on the site after
              the next update.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 rounded-2xl border border-primary/40 px-8 py-3 text-sm font-semibold uppercase tracking-widest transition hover:border-primary hover:text-primary"
            >
              Submit Another Game
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="upload" className="relative py-24">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.55 0.28 305 / 0.18), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/80">
            Submit Your Build
          </span>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Upload Your <span className="neon-text">Game</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Share your creation with the community. We only store the Google Drive link — no files
            are hosted here.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mt-10 glass rounded-3xl p-6 md:p-10 shadow-[0_20px_60px_-20px_oklch(0.55_0.28_305_/_0.6)]"
        >
          {status === "error" && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              Submission failed. Please try again or check your internet connection.
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {/* Game Title */}
            <div>
              <Label>Game Title *</Label>
              <div className={fieldCls(errors.gameName)}>
                <input
                  id="upload-game-name"
                  type="text"
                  placeholder="Shadow Strike"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {errors.gameName && (
                <p className="mt-1 text-xs text-destructive">{errors.gameName}</p>
              )}
            </div>

            {/* Developer Name */}
            <div>
              <Label>Developer / Group Name *</Label>
              <div className={fieldCls(errors.groupName)}>
                <input
                  id="upload-group-name"
                  type="text"
                  placeholder="Your studio or group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {errors.groupName && (
                <p className="mt-1 text-xs text-destructive">{errors.groupName}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label>Category *</Label>
              <select
                id="upload-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="mt-2 w-full rounded-xl border border-primary/30 bg-input/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:shadow-[0_0_20px_oklch(0.55_0.28_305_/_0.4)]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} className="bg-card">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Drive Link */}
            <div>
              <Label>Google Drive Download Link *</Label>
              <div className={fieldCls(errors.driveLink)}>
                <Link2 className="size-4 shrink-0 text-muted-foreground" />
                <input
                  id="upload-drive-link"
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {errors.driveLink && (
                <p className="mt-1 text-xs text-destructive">{errors.driveLink}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label>Game Description *</Label>
              <textarea
                id="upload-description"
                rows={4}
                placeholder="Describe your game — genre, mechanics, story..."
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${errors.description ? "border-destructive/60 bg-destructive/5" : "border-primary/30 bg-input/40 focus:border-primary focus:shadow-[0_0_20px_oklch(0.55_0.28_305_/_0.4)]"}`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-destructive">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            id="upload-submit"
            type="submit"
            disabled={status === "loading"}
            className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] px-8 py-4 text-base font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-[position:100%_0] hover:shadow-[0_0_50px_oklch(0.55_0.28_305_/_0.9)] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ boxShadow: "0 0 30px oklch(0.55 0.28 305 / 0.55)" }}
          >
            <Rocket className="size-5 transition group-hover:-translate-y-0.5 group-hover:rotate-12" />
            {status === "loading" ? "Submitting..." : "Launch Submission"}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Your data is sent directly to our review sheet. Games appear on the site after the next
            update.
          </p>
        </motion.form>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </label>
  );
}

function fieldCls(error?: string) {
  return `mt-2 flex items-center gap-2 rounded-xl border px-4 transition focus-within:shadow-[0_0_20px_oklch(0.55_0.28_305_/_0.4)] ${
    error
      ? "border-destructive/60 bg-destructive/5 focus-within:border-destructive"
      : "border-primary/30 bg-input/40 focus-within:border-primary"
  }`;
}
