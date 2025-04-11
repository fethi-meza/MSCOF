
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Users,
  Book,
  Calendar,
  UserCheck,
  Award,
  Settings,
  BarChart3,
  Building,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: <Home size={18} />, path: '/' },
    { name: 'Students', icon: <Users size={18} />, path: '/students' },
    { name: 'Instructors', icon: <UserCheck size={18} />, path: '/instructors' },
    { name: 'Formations', icon: <Book size={18} />, path: '/formations' },
    { name: 'Calendar', icon: <Calendar size={18} />, path: '/calendar' },
    { name: 'Departments', icon: <Building size={18} />, path: '/departments' },
    { name: 'Courses', icon: <GraduationCap size={18} />, path: '/courses' },
    { name: 'Grades', icon: <Award size={18} />, path: '/grades' },
    { name: 'Reports', icon: <BarChart3 size={18} />, path: '/reports' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  ];

  return (
    <div className="h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <GraduationCap size={24} className="text-accent" />
          <span className="font-heading font-bold text-lg">MSCOF</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="text-sidebar-foreground">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/70">
          <p>© 2025 MSCOF</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
