import React, { useState, useEffect, useRef } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { uploadToCloudinary } from "../lib/upload";
import {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  type Product,
  type FirestoreProduct,
} from "../lib/products";

// ─── Config ───────────────────────────────────────────────────────────────────
const ADMIN_EMAILS = ["boroshenitha@gmail.com", "9jaideepbh@gmail.com"];
const CATEGORIES = ["F1 PRINT", "MOVIE PRINT", "KANNADA", "3D PRINT"] as const;
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL"] as const;

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "24px 16px",
    paddingBottom: "60px",
  } as React.CSSProperties,

  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  card: {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
    padding: "36px 32px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
    color: "#f0f0f0",
  } as React.CSSProperties,

  heading: {
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    marginBottom: "6px",
    color: "#fff",
    textAlign: "center" as const,
  } as React.CSSProperties,

  sub: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center" as const,
    marginBottom: "28px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: "6px",
    marginTop: "18px",
  } as React.CSSProperties,

  input: {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border 0.2s",
  } as React.CSSProperties,

  select: {
    width: "100%",
    padding: "11px 14px",
    background: "#1e1b4b",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  textarea: {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
    resize: "vertical" as const,
    minHeight: "80px",
    fontFamily: "inherit",
  } as React.CSSProperties,

  sizeRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
    marginTop: "4px",
  } as React.CSSProperties,

  sizeBtn: (active: boolean): React.CSSProperties => ({
    padding: "8px 18px",
    borderRadius: "8px",
    border: active ? "1px solid #a78bfa" : "1px solid rgba(255,255,255,0.18)",
    background: active ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)",
    color: active ? "#a78bfa" : "rgba(255,255,255,0.6)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    transition: "all 0.18s",
  }),

  fileZone: {
    border: "1.5px dashed rgba(167,139,250,0.4)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center" as const,
    cursor: "pointer",
    color: "rgba(255,255,255,0.4)",
    fontSize: "13px",
    marginTop: "4px",
  } as React.CSSProperties,

  previewRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
    marginTop: "10px",
  } as React.CSSProperties,

  preview: {
    width: "60px",
    height: "60px",
    objectFit: "cover" as const,
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
  } as React.CSSProperties,

  btn: (disabled: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "14px",
    marginTop: "24px",
    borderRadius: "12px",
    border: "none",
    background: disabled
      ? "rgba(255,255,255,0.1)"
      : "linear-gradient(135deg, #7c3aed, #a855f7)",
    color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
    fontWeight: 700,
    fontSize: "15px",
    letterSpacing: "0.06em",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    boxShadow: disabled ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
  }),

  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "rgba(255,255,255,0.6)",
    borderRadius: "8px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "12px",
    letterSpacing: "0.08em",
  } as React.CSSProperties,

  alert: (type: "success" | "error"): React.CSSProperties => ({
    padding: "12px 16px",
    borderRadius: "10px",
    marginTop: "16px",
    fontSize: "13px",
    fontWeight: 600,
    background: type === "success" ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)",
    border: type === "success" ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(239,68,68,0.4)",
    color: type === "success" ? "#6ee7b7" : "#fca5a5",
    textAlign: "center" as const,
  }),

  progress: {
    height: "4px",
    borderRadius: "2px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginTop: "12px",
  } as React.CSSProperties,

  progressBar: (pct: number): React.CSSProperties => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #7c3aed, #a855f7)",
    transition: "width 0.3s ease",
  }),
};

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) return setError("Enter email and password.");
    setLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...S.page, ...S.center }}>
      <div style={S.card}>
        <div style={S.heading}>🛡️ Admin Login</div>
        <div style={S.sub}>Shrinidhi Creations</div>
        <label style={S.label}>Email</label>
        <input style={S.input} type="email" placeholder="admin@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        <label style={S.label}>Password</label>
        <input style={S.input} type="password" placeholder="••••••••" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        {error && <div style={S.alert("error")}>{error}</div>}

        <button style={S.btn(loading)} disabled={loading} onClick={handleLogin}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

// ─── Access Denied ────────────────────────────────────────────────────────────
function AccessDenied({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ ...S.page, ...S.center }}>
      <div style={{ ...S.card, textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🚫</div>
        <div style={S.heading}>Access Denied</div>
        <div style={{ ...S.sub, marginBottom: "20px" }}>Your account is not authorised.</div>
        <button style={S.logoutBtn} onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}

// ─── Upload Form ──────────────────────────────────────────────────────────────
const INITIAL_FORM = {
  name: "",
  category: CATEGORIES[0] as string,
  description: "",
  price: "",
  sizes: [] as string[],
};

function UploadForm({ onUploaded }: { onUploaded: () => void }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const toggleSize = (s: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 5) {
      setAlert({ type: "error", msg: "Maximum 5 images allowed." });
      return;
    }
    const combined = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(combined);
    setImagePreviews(combined.map((f) => URL.createObjectURL(f)));
    setAlert(null);
  };

  const removeImage = (idx: number) => {
    const updated = imageFiles.filter((_, i) => i !== idx);
    setImageFiles(updated);
    setImagePreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return setAlert({ type: "error", msg: "Product name is required." });
    if (!form.description.trim()) return setAlert({ type: "error", msg: "Description is required." });
    if (imageFiles.length === 0) return setAlert({ type: "error", msg: "Upload at least 1 image." });

    setLoading(true);
    setProgress(0);
    setAlert(null);

    try {
      const urls: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const url = await uploadToCloudinary(imageFiles[i]);
        urls.push(url);
        setProgress(Math.round(((i + 1) / (imageFiles.length + (videoFile ? 1 : 0))) * 90));
      }

      let videoUrl = "";
      if (videoFile) {
        const fd = new FormData();
        fd.append("file", videoFile);
        fd.append("upload_preset", "products_upload");
        const res = await fetch("https://api.cloudinary.com/v1_1/ddcxdhu3k/video/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        videoUrl = data.secure_url || "";
        setProgress(90);
      }

      const product: Product = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : null,
        sizes: form.sizes,
        images: urls,
        video: videoUrl,
        createdAt: new Date(),
      };

      await addProduct(product);
      setProgress(100);
      setAlert({ type: "success", msg: "✅ Product uploaded successfully!" });
      setForm(INITIAL_FORM);
      setImageFiles([]);
      setImagePreviews([]);
      setVideoFile(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      setTimeout(() => { onUploaded(); }, 1000);
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", msg: "❌ Upload failed. Please try again." });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "520px", margin: "0 auto" }}>
      {/* Name */}
      <label style={S.label}>Product Name *</label>
      <input style={S.input} placeholder="e.g. Virat Kohli Jersey" value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />

      {/* Category */}
      <label style={S.label}>Category *</label>
      <select style={S.select} value={form.category}
        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Description */}
      <label style={S.label}>Description *</label>
      <textarea style={S.textarea} placeholder="Enter product description…" value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />

      {/* Price */}
      <label style={S.label}>Price (₹) — Optional</label>
      <input style={S.input} type="number" placeholder="e.g. 499" value={form.price}
        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />

      {/* Sizes */}
      <label style={S.label}>Sizes</label>
      <div style={S.sizeRow}>
        {SIZE_OPTIONS.map((s) => (
          <button key={s} style={S.sizeBtn(form.sizes.includes(s))}
            onClick={() => toggleSize(s)} type="button">{s}</button>
        ))}
      </div>

      {/* Images */}
      <label style={S.label}>Images * (1–5)</label>
      <div style={S.fileZone} onClick={() => imageInputRef.current?.click()}>
        {imageFiles.length === 0 ? "📷 Click to select images (max 5)" : `${imageFiles.length} image(s) selected — click to add more`}
        <input ref={imageInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImages} />
      </div>
      {imagePreviews.length > 0 && (
        <div style={S.previewRow}>
          {imagePreviews.map((src, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={src} alt="" style={S.preview} />
              <button onClick={() => removeImage(i)} style={{
                position: "absolute", top: "-6px", right: "-6px",
                background: "#ef4444", border: "none", borderRadius: "50%",
                width: "18px", height: "18px", color: "#fff", fontSize: "10px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Video */}
      <label style={S.label}>Video — Optional</label>
      <div style={S.fileZone} onClick={() => videoInputRef.current?.click()}>
        {videoFile ? `🎬 ${videoFile.name}` : "🎬 Click to select a video"}
        <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }}
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
      </div>

      {loading && <div style={S.progress}><div style={S.progressBar(progress)} /></div>}
      {alert && <div style={S.alert(alert.type)}>{alert.msg}</div>}

      <button style={S.btn(loading)} disabled={loading} onClick={handleSubmit}>
        {loading ? `Uploading… ${progress}%` : "Upload Product"}
      </button>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({
  product,
  onClose,
  onSaved,
}: {
  product: FirestoreProduct;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price != null ? String(product.price) : "",
    sizes: product.sizes ?? [],
  });
  const [existingImages, setExistingImages] = useState<string[]>(product.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleSize = (s: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = existingImages.length + newFiles.length + files.length;
    if (total > 5) { setAlert({ type: "error", msg: "Max 5 images total." }); return; }
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    setAlert(null);
  };

  const removeExisting = (idx: number) =>
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));

  const removeNew = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return setAlert({ type: "error", msg: "Name is required." });
    if (existingImages.length + newFiles.length === 0)
      return setAlert({ type: "error", msg: "At least 1 image required." });

    setLoading(true);
    setAlert(null);
    try {
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }
      const finalImages = [...existingImages, ...uploadedUrls];

      await updateProduct(product.id, {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : null,
        sizes: form.sizes,
        images: finalImages,
      });

      setAlert({ type: "success", msg: "✅ Product updated!" });
      setTimeout(() => { onSaved(); onClose(); }, 800);
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", msg: "❌ Update failed." });
    } finally {
      setLoading(false);
    }
  };

  const overlay: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
    display: "flex", alignItems: "flex-start", justifyContent: "center",
    padding: "20px 16px", overflowY: "auto",
  };

  const modal: React.CSSProperties = {
    background: "#1a1733",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
    padding: "28px 24px",
    width: "100%",
    maxWidth: "500px",
    color: "#f0f0f0",
    position: "relative",
    marginTop: "auto",
    marginBottom: "auto",
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontWeight: 700, fontSize: "16px", color: "#fff" }}>✏️ Edit Product</span>
          <button onClick={onClose} style={{ ...S.logoutBtn, padding: "4px 10px", fontSize: "18px" }}>✕</button>
        </div>

        <label style={S.label}>Name *</label>
        <input style={S.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />

        <label style={S.label}>Category</label>
        <select style={S.select} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={S.label}>Description</label>
        <textarea style={S.textarea} value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />

        <label style={S.label}>Price (₹)</label>
        <input style={S.input} type="number" value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />

        <label style={S.label}>Sizes</label>
        <div style={S.sizeRow}>
          {SIZE_OPTIONS.map((s) => (
            <button key={s} style={S.sizeBtn(form.sizes.includes(s))} onClick={() => toggleSize(s)} type="button">{s}</button>
          ))}
        </div>

        {/* Existing images */}
        <label style={S.label}>Current Images</label>
        <div style={S.previewRow}>
          {existingImages.map((url, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={url} alt="" style={S.preview} referrerPolicy="no-referrer" />
              <button onClick={() => removeExisting(i)} style={{
                position: "absolute", top: "-6px", right: "-6px",
                background: "#ef4444", border: "none", borderRadius: "50%",
                width: "18px", height: "18px", color: "#fff", fontSize: "10px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
          ))}
        </div>

        {/* Add new images */}
        {existingImages.length + newFiles.length < 5 && (
          <>
            <div style={{ ...S.fileZone, marginTop: "10px" }} onClick={() => fileRef.current?.click()}>
              ➕ Add more images
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleNewImages} />
            </div>
            {newPreviews.length > 0 && (
              <div style={S.previewRow}>
                {newPreviews.map((src, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={src} alt="" style={S.preview} />
                    <button onClick={() => removeNew(i)} style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      background: "#ef4444", border: "none", borderRadius: "50%",
                      width: "18px", height: "18px", color: "#fff", fontSize: "10px",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {alert && <div style={S.alert(alert.type)}>{alert.msg}</div>}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={onClose} style={{ ...S.logoutBtn, flex: 1, padding: "12px" }}>Cancel</button>
          <button onClick={handleSave} disabled={loading} style={{ ...S.btn(loading), marginTop: 0, flex: 2 }}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Management Dashboard ────────────────────────────────────────────
function ManageDashboard({
  onRefreshNeeded,
}: {
  onRefreshNeeded: () => void;
}) {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<FirestoreProduct | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const load = () => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(() => setAlert({ type: "error", msg: "Failed to load products." }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setAlert({ type: "success", msg: `🗑️ "${name}" deleted.` });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      onRefreshNeeded();
    } catch {
      setAlert({ type: "error", msg: "❌ Delete failed." });
    } finally {
      setDeletingId(null);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "14px",
    marginTop: "16px",
  };

  const productCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const imgBox: React.CSSProperties = {
    width: "100%",
    aspectRatio: "1/1",
    objectFit: "cover",
    background: "#111",
    display: "block",
  };

  const cardBody: React.CSSProperties = {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.4)" }}>
      Loading products…
    </div>
  );

  return (
    <div>
      {alert && <div style={{ ...S.alert(alert.type), marginBottom: "16px" }}>{alert.msg}</div>}

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
          No products yet. Upload one!
        </div>
      ) : (
        <div>
          {CATEGORIES.map(cat => {
            const catItems = products.filter(p => p.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat} style={{ marginTop: '24px' }}>
                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', color: '#a78bfa', fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat}</h3>
                <div style={gridStyle}>
                  {catItems.map((p) => (
                    <div key={p.id} style={productCard}>
                      <img
                        src={p.images?.[0] ?? ""}
                        alt={p.name}
                        style={imgBox}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div style={cardBody}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                          {p.name}
                        </div>
                        <div style={{
                          fontSize: "10px", color: "#a78bfa",
                          background: "rgba(167,139,250,0.1)",
                          borderRadius: "6px", padding: "2px 6px",
                          alignSelf: "flex-start", fontWeight: 600,
                        }}>
                          {p.category}
                        </div>
                        {p.price != null && (
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                            ₹{p.price}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                          <button
                            onClick={() => setEditTarget(p)}
                            style={{
                              flex: 1, padding: "6px 0", borderRadius: "8px", border: "1px solid #a78bfa",
                              background: "rgba(167,139,250,0.1)", color: "#a78bfa",
                              fontSize: "11px", fontWeight: 700, cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            style={{
                              flex: 1, padding: "6px 0", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.4)",
                              background: "rgba(239,68,68,0.1)", color: "#fca5a5",
                              fontSize: "11px", fontWeight: 700, cursor: "pointer",
                            }}
                          >
                            {deletingId === p.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editTarget && (
        <EditModal
          product={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => { load(); onRefreshNeeded(); }}
        />
      )}
    </div>
  );
}

// ─── Broadcast Manager ───────────────────────────────────────────────────────────
function OfferManager() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [format, setFormat] = useState("Modal Popup");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error", msg: string } | null>(null);

  const loadCampaigns = () => {
    import("../lib/announcement").then(({ getCampaigns }) => {
      getCampaigns().then(res => {
        setCampaigns(res);
        setLoading(false);
      }).catch(err => {
        console.error("Error loading campaigns:", err);
        setLoading(false);
        setAlert({ type: "error", msg: "Failed to load campaigns from database." });
      });
    }).catch(err => {
      console.error("Failed to load module:", err);
      setLoading(false);
    });
  };

  useEffect(() => { loadCampaigns(); }, []);

  const handleSave = async () => {
    if (!text.trim()) { setAlert({ type: "error", msg: "Message content is required." }); return; }
    setSaving(true);
    setAlert(null);
    try {
      const { addCampaign } = await import("../lib/announcement");
      await addCampaign({ text: text.trim(), format, isActive: true });
      setText("");
      loadCampaigns();
      setAlert({ type: "success", msg: "✅ Campaign activated!" });
    } catch {
      setAlert({ type: "error", msg: "❌ Failed to save." });
    } finally {
      setSaving(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      const { deleteCampaign } = await import("../lib/announcement");
      await deleteCampaign(id);
      loadCampaigns();
    } catch {
      window.alert("Failed to delete.");
    }
  };

  const cyan = "#00e5ff";
  const darkBg = "#0b1014";
  const panelBg = "#11181f";
  const border = "1px solid rgba(255,255,255,0.08)";

  if (loading) return <div style={{ color: "rgba(255,255,255,0.4)", padding: "20px" }}>Loading campaigns...</div>;

  return (
    <div style={{ textAlign: "left", background: darkBg, padding: "32px", borderRadius: "12px", border: border, color: "#fff", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", fontStyle: "italic", margin: 0, textTransform: "uppercase" }}>
          ADS
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginTop: "4px", margin: 0 }}>
          Manage your premium fashion platform
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
        {/* Left Col - Live Promo Engine */}
        <div style={{ flex: "1 1 350px", background: panelBg, borderRadius: "8px", padding: "24px", border: border }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: "0 0 4px 0" }}>Live Promo Engine</h3>
          <p style={{ color: cyan, fontSize: "11px", margin: "0 0 24px 0" }}>Create real-time announcements and popups</p>

          <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.8)", marginBottom: "6px", fontWeight: 600 }}>Message Content</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Flat 20% Off Today Only!"
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: border, borderRadius: "4px", color: "#fff", fontSize: "13px", marginBottom: "20px", outline: "none", boxSizing: "border-box" }}
          />

          <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.8)", marginBottom: "6px", fontWeight: 600 }}>Display Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", background: "#1a2128", border: border, borderRadius: "4px", color: "#fff", fontSize: "13px", marginBottom: "24px", outline: "none", boxSizing: "border-box" }}
          >
            <option>Modal Popup</option>
            <option>Top Banner</option>
          </select>

          {/* Live Preview Box */}
          <div style={{ border: `1px solid ${cyan}`, borderRadius: "4px", padding: "20px 16px", marginBottom: "24px", position: "relative" }}>
            <div style={{ position: "absolute", top: "-8px", left: "12px", background: panelBg, padding: "0 8px", color: cyan, fontSize: "10px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
              LIVE PREVIEW
            </div>
            <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>
                {text || "Flat 20% Off Today Only!"} - <span style={{ color: cyan, textDecoration: "underline", cursor: "pointer" }}>Shop Now</span>
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", cursor: "pointer" }}>✕</span>
            </div>
          </div>

          {alert && <div style={{ fontSize: "12px", padding: "10px", background: alert.type === "success" ? "rgba(0,255,255,0.1)" : "rgba(255,0,0,0.1)", border: `1px solid ${alert.type === "success" ? cyan : "red"}`, color: alert.type === "success" ? cyan : "#fca5a5", marginBottom: "16px", borderRadius: "4px" }}>{alert.msg}</div>}

          <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "12px", background: cyan, color: "#111", border: "none", borderRadius: "4px", fontWeight: 800, fontSize: "14px", cursor: saving ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
            {saving ? "Deploying..." : "Activate Campaign"}
          </button>
        </div>

        {/* Right Col - Active Campaigns */}
        <div style={{ flex: "1 1 250px", background: panelBg, borderRadius: "8px", padding: "24px", border: border }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>Active Campaigns</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {campaigns.length === 0 ? (
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", padding: "20px 0", textAlign: "center" }}>No active campaigns to display.</div>
            ) : (
              campaigns.map(c => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "16px", borderBottom: border }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#fff", fontWeight: 600, marginBottom: "8px" }}>{c.text || "Unnamed Campaign"}</div>
                    <div style={{ fontSize: "9px", color: cyan, border: `1px solid ${cyan}`, borderRadius: "12px", padding: "2px 8px", display: "inline-block", letterSpacing: "1px", fontWeight: 700 }}>
                      {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "16px", color: "rgba(255,255,255,0.4)" }}>
                    <span style={{ cursor: "not-allowed", fontSize: "14px", opacity: 0.6 }} title="Edit (Disabled)">📝</span>
                    <span onClick={() => handleDelete(c.id)} style={{ cursor: "pointer", fontSize: "14px", transition: "opacity 0.2s" }} onMouseOver={e => e.currentTarget.style.opacity = "1"} onMouseOut={e => e.currentTarget.style.opacity = "0.6"} title="Delete">🗑️</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
function AdminDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<"upload" | "manage" | "offers">("manage");
  const [refreshKey, setRefreshKey] = useState(0);

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "10px 0",
    borderRadius: "10px",
    border: "none",
    background: active ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(255,255,255,0.05)",
    color: active ? "#fff" : "rgba(255,255,255,0.4)",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.06em",
  });

  return (
    <div style={S.page}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>
              🛍️ Admin Panel
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
              {user.email}
            </div>
          </div>
          <button style={S.logoutBtn} onClick={() => signOut(auth)}>Sign Out</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button style={tabBtn(tab === "manage")} onClick={() => setTab("manage")}>
            📋 Manage Products
          </button>
          <button style={tabBtn(tab === "upload")} onClick={() => setTab("upload")}>
            ➕ Upload New
          </button>
          <button style={tabBtn(tab === "offers")} onClick={() => setTab("offers")}>
            📢 Ad Engine
          </button>
        </div>

        {/* Content */}
        {tab === "upload" ? (
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <UploadForm onUploaded={() => { setRefreshKey((k) => k + 1); setTab("manage"); }} />
          </div>
        ) : tab === "offers" ? (
          <OfferManager />
        ) : (
          <ManageDashboard key={refreshKey} onRefreshNeeded={() => setRefreshKey((k) => k + 1)} />
        )}
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────
export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <div style={{ ...S.page, ...S.center }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", letterSpacing: "0.1em" }}>
          Checking authentication…
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");
  if (!isAdmin) return <AccessDenied onLogout={() => signOut(auth)} />;

  return <AdminDashboard user={user} />;
}