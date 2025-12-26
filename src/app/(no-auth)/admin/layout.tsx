import { ReactNode } from "react";

export default function NoAuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className='min-h-screen'>{children}</div>;
}
