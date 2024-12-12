interface ReportCardLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function ReportCardLayout({
  title,
  children,
}: ReportCardLayoutProps) {
  return (
    <div
      style={{
        width: '70%',
        textAlign: 'center',
        fontSize: '30px',
        color: '#333',
        marginBottom: '10px',
        padding: '10px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <h1>{title}</h1>
      {children}
    </div>
  );
}
