import { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { removeNotification } from '../store/slices/uiSlice';
import type { Notification } from '../types';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'border-l-status-done bg-status-done-bg text-status-done',
  error: 'border-l-destructive bg-destructive/10 text-destructive',
  info: 'border-l-accent bg-accent/10 text-accent',
  warning: 'border-l-status-todo bg-status-todo-bg text-status-todo',
};

function Toast({ notif }: { notif: Notification }) {
  const dispatch = useAppDispatch();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const Icon = icons[notif.type];

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      dispatch(removeNotification(notif.id));
    }, 4000);
    return () => clearTimeout(timerRef.current);
  }, [dispatch, notif.id]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border border-border border-l-4 shadow-lg bg-card animate-slide-in-right ${colors[notif.type]}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="text-sm font-medium text-foreground flex-1">{notif.message}</p>
      <button
        onClick={() => dispatch(removeNotification(notif.id))}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Fermer la notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

const ToastContainer = () => {
  const notifications = useAppSelector(s => s.ui.notifications);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
      aria-label="Notifications"
    >
      {notifications.map(n => (
        <Toast key={n.id} notif={n} />
      ))}
    </div>
  );
};

export default ToastContainer;
