import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../stack/server";

export default function Handler() {
  return (
    <div className="stack-auth-wrapper position-relative">
      <StackHandler fullPage app={stackServerApp} />
    </div>
  );
}
