import Navbar from '@components/components/Navbar';
import React from 'react'

export default function applyLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <div>
          <Navbar/>
          <main>{children}</main>
        </div>
    );
  }