export default function Input({ label, type = 'text', value, onChange, placeholder, ...props }) {
  return (
    <label style={{ display: 'block', width: '100%' }}>
      {label && <div className="muted" style={{ marginBottom: 6 }}>{label}</div>}
      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
}


