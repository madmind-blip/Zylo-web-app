import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Send, Bug, MessageSquare, Code, CheckCircle2, AlertCircle } from 'lucide-react';
import { createFeedbackWhatsAppUrl } from '../utils/whatsapp';
import { BRAND } from '../data/content';

export type FeedbackType = 'General Feedback' | 'Bug Report' | 'Contact Developer';

interface ContactFeedbackProps {
  onBackToHome: () => void;
}

export const ContactFeedback: React.FC<ContactFeedbackProps> = ({ onBackToHome }) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('General Feedback');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message before sending.');
      return;
    }

    setError(null);
    const url = createFeedbackWhatsAppUrl(feedbackType, message, name);
    window.open(url, '_blank');
    setSubmitted(true);
  };

  const handleReset = () => {
    setMessage('');
    setName('');
    setFeedbackType('General Feedback');
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-body text-[#1A1A1A] pb-20">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="bg-white border-b border-neutral-200/80 sticky top-16 sm:top-20 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Store</span>
          </button>

          <div className="text-[11px] sm:text-xs text-neutral-400 font-mono">
            Support • Kota, RJ
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-[11px] sm:text-xs font-medium uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-[#4A5D45]" />
            <span>Direct Support & Developer Channel</span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1A1A1A] mb-3">
            Contact & Feedback
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto font-normal leading-relaxed">
            Have thoughts on our streetwear combos, discovered a bug, or want to connect with the developer? Send a direct message.
          </p>
        </div>

        {/* Success Confirmation Banner */}
        {submitted && (
          <div className="mb-8 p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-sm text-emerald-900">
                  WhatsApp opened with your message!
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                  Your feedback was formatted and loaded into WhatsApp. Press Send in your chat to deliver it directly to our team at {BRAND.whatsappDisplay}.
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline shrink-0 cursor-pointer"
            >
              Send another
            </button>
          </div>
        )}

        {/* Main Feedback Form Card */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type Dropdown */}
            <div>
              <label
                htmlFor="feedback-type"
                className="block text-xs sm:text-sm font-semibold text-[#1A1A1A] mb-2 font-heading"
              >
                Feedback Type
              </label>
              <div className="relative">
                <select
                  id="feedback-type"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all cursor-pointer font-body appearance-none"
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Contact Developer">Contact Developer</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1.5">
                {feedbackType === 'General Feedback' && 'Share your ideas, product suggestions, or impressions of Zyle.'}
                {feedbackType === 'Bug Report' && 'Report broken buttons, display issues, or checkout errors.'}
                {feedbackType === 'Contact Developer' && 'Reach out regarding site architecture, features, or custom inquiries.'}
              </p>
            </div>

            {/* Name Input (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="user-name"
                  className="block text-xs sm:text-sm font-semibold text-[#1A1A1A] font-heading"
                >
                  Your Name
                </label>
                <span className="text-[11px] text-neutral-400 font-mono">Optional</span>
              </div>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tushar"
                className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all font-body"
              />
            </div>

            {/* Message Textarea (Required) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="user-message"
                  className="block text-xs sm:text-sm font-semibold text-[#1A1A1A] font-heading"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-neutral-400 font-mono">Required</span>
              </div>
              <textarea
                id="user-message"
                rows={5}
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Type your message, suggestions, or bug details here..."
                className={`w-full bg-[#FAFAFA] border ${
                  error ? 'border-red-400 bg-red-50/20' : 'border-neutral-200'
                } rounded-xl p-4 text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all font-body resize-y`}
              />
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Preview of Formatted WhatsApp Message */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Message Preview (WhatsApp):
              </div>
              <div className="font-mono text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-neutral-200/60">
                Zyle Feedback{'\n'}
                Type: {feedbackType}{'\n'}
                {name.trim() ? `Name: ${name.trim()}\n` : ''}
                Message: {message.trim() || '[Your message here]'}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-sm transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Send on WhatsApp</span>
                <Send className="w-4 h-4 ml-1" />
              </button>

              <p className="text-center text-[11px] text-neutral-500 mt-3 font-body">
                Opens directly in WhatsApp with prefilled message to{' '}
                <span className="font-medium text-[#1A1A1A]">{BRAND.whatsappDisplay}</span>
              </p>
            </div>
          </form>
        </div>

        {/* Quick Context & Info Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[#1A1A1A] mb-3">
              <MessageSquare className="w-4 h-4 text-[#4A5D45]" />
            </div>
            <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#1A1A1A] mb-1">
              General Feedback
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Tell us what products, combos, or watch designs you want to see next in Kota.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[#1A1A1A] mb-3">
              <Bug className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#1A1A1A] mb-1">
              Bug Reports
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Found a broken button, slow image, or responsive bug? We fix issues rapidly.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[#1A1A1A] mb-3">
              <Code className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#1A1A1A] mb-1">
              Contact Developer
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Technical feedback, partnership queries, or direct chat with the engineering team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
