import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MYMeal AI - 智能膳食计划',
  description: '为马来西亚用户打造的AI驱动个性化膳食计划系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}



