export interface HeaderProps {
  activeNavId?: string;
  onNavigate?: (id: string) => void;
  onBellClick?: () => void;
  userName?: string;
}

export function Header({ 
  activeNavId = "catalog", 
  onNavigate = () => {}, 
  onBellClick = () => {},
  userName = "Гость" 
}: HeaderProps) {
  
  const getInitials = (name: string) => {
    const [a = "", b = ""] = name.trim().split(/\s+/);
    return (a[0] ?? "").concat(b[0] ?? "").toUpperCase();
  };

  const navItems = [
    { id: "catalog", label: "Каталог аудиторий" },
    { id: "bookings", label: "Управление бронированием" },
    { id: "settings", label: "Настройки" },
  ];

  return (
    <header className="app-header">
      <div className="app-logo">
        <div className="logo-icon"></div>
        <span className="app-title">Room Booking</span>
      </div>

      <nav className="app-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${activeNavId === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={item.label}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-right">
        <button 
          className="notification-btn"
          onClick={onBellClick}
          title="Уведомления"
        >
          
        </button>
        
        <div 
          className="user-avatar"
          title={userName}
        >
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
}