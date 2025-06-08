import React from "react";

const Footer = () => {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Huddle. All rights reserved.
        </p>
        <p className="text-muted-foreground text-sm"> Made with ❤️ by Jol</p>
      </div>
    </footer>
  );
};

export default Footer;
