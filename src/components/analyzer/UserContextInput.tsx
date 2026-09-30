import React, { useState } from 'react';
import type { UserContext } from '../../types/analyzer';
import { UserCheck, ChevronDown, ChevronUp, User, Mail, AtSign } from 'lucide-react';
import { Card } from '../common/Card';

interface UserContextInputProps {
  context: UserContext;
  onChange: (context: UserContext) => void;
}

export const UserContextInput: React.FC<UserContextInputProps> = ({ context, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-dashed border-slate-300 dark:border-slate-700/80 transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer text-left focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-500/20 transition-colors">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">
              Personalized Credential Audit (Optional)
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Provide your name/email to test if your password contains personal info
            </p>
          </div>
        </div>

        <div className="text-slate-500 dark:text-slate-400 p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 transition-colors">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-500 dark:text-slate-400" /> Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Alice Johnson"
              value={context.name || ''}
              onChange={(e) => onChange({ ...context, name: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-500 dark:text-slate-400" /> Your Email
            </label>
            <input
              type="email"
              placeholder="e.g. alice@example.com"
              value={context.email || ''}
              onChange={(e) => onChange({ ...context, email: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <AtSign className="w-3 h-3 text-slate-500 dark:text-slate-400" /> Username
            </label>
            <input
              type="text"
              placeholder="e.g. alice_j"
              value={context.username || ''}
              onChange={(e) => onChange({ ...context, username: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      )}
    </Card>
  );
};
