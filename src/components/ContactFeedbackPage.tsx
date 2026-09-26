import React, { useState } from 'react';
import { Send, ArrowLeft, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ContactFeedbackPageProps {
  onBackToHome: () => void;
}

type FeedbackType = 'General Feedback' | 'Bug Report' | 'Contact Developer';

export const ContactFeedbackPage: React.FC<ContactFeedbackPageProps> = ({ onBackToHome }) => {
  const [name, setName] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('General Feedback');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    const recipient = 'contact.tusharhota@gmail.com';
    const subject = `Zyle Developer Feedback - ${feedbackType}`;
    const bodyLines = [
      `Name: ${name.trim() ? name.trim() : 'Not provided'}`,
      `Feedback Type: ${feedbackType}`,
      '',
      'Message:',
      message.trim(),
    ];
    const body = bodyLines.join('\n');

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open user's email client
    window.location.href = mailtoUrl;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] text-[#1A1A1A] py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Store</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Developer Feedback & Support</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A] tracking-tight mb-3">
            Contact & Feedback
          </h1>
          <p className="font-body text-neutral-600 text-xs sm:text-base max-w-md mx-auto leading-relaxed">
            Have a suggestion, found a bug, or want to reach out to the developer? Share your thoughts below.
          </p>
        </div>

        {/* Clean Light-Themed Form Card */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xs">
          {isSubmitted && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Email client triggered!</p>
                <p className="text-emerald-700 text-xs">
                  Your mail app was opened with pre-filled details. If it didn't open automatically, you can write directly to{' '}
                  <a
                    href="mailto:contact.tusharhota@gmail.com"
                    className="underline font-semibold"
                  >
                    contact.tusharhota@gmail.com
                  </a>.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Feedback Type Dropdown */}
            <div>
              <label
                htmlFor="feedback-type"
                className="block text-xs sm:text-sm font-semibold text-[#1A1A1A] mb-1.5"
              >
                Feedback Type
              </label>
              <div className="relative">
                <select
                  id="feedback-type"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  className="w-full appearance-none px-4 py-3 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-[#1A1A1A] focus:bg-white rounded-xl text-xs sm:text-sm text-[#1A1A1A] font-body transition-all outline-none cursor-pointer"
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Contact Developer">Contact Developer</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-neutral-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Name Field (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="user-name"
                  className="text-xs sm:text-sm font-semibold text-[#1A1A1A]"
                >
                  Your Name
                </label>
                <span className="text-[11px] text-neutral-400 font-medium">Optional</span>
              </div>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-[#1A1A1A] focus:bg-white rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 font-body transition-all outline-none"
              />
            </div>

            {/* Message Field (Required) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="user-message"
                  className="text-xs sm:text-sm font-semibold text-[#1A1A1A]"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-neutral-400 font-medium">Required</span>
              </div>
              <textarea
                id="user-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your feedback, question, or issue details here..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-[#1A1A1A] focus:bg-white rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 font-body transition-all outline-none resize-y min-h-[120px]"
              />
            </div>

            {/* Action Area */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-sm transition-all duration-200 shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Feedback</span>
              </button>

              {/* Brief note near the button */}
              <p className="mt-2.5 text-center text-xs text-neutral-500 font-body">
                This will open your email app to send us your message
              </p>
            </div>
          </form>

          {/* Quick Info Box */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>Direct Developer Email:</span>
              <a
                href="mailto:contact.tusharhota@gmail.com"
                className="text-[#1A1A1A] font-medium hover:underline truncate"
              >
                contact.tusharhota@gmail.com
              </a>
            </div>
            <button
              type="button"
              onClick={onBackToHome}
              className="text-[#1A1A1A] font-semibold hover:underline cursor-pointer"
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
