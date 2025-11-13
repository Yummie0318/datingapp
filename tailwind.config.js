/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // keep your dark mode toggle
    theme: {
      extend: {
        colors: {
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          card: 'var(--card)',
          'card-foreground': 'var(--card-foreground)',
          primary: 'var(--primary)',
          'primary-foreground': 'var(--primary-foreground)',
          secondary: 'var(--secondary)',
          'secondary-foreground': 'var(--secondary-foreground)',
          muted: 'var(--muted)',
          'muted-foreground': 'var(--muted-foreground)',
          accent: 'var(--accent)',
          'accent-foreground': 'var(--accent-foreground)',
          destructive: 'var(--destructive)',
          'destructive-foreground': 'var(--destructive-foreground)',
          border: 'var(--border)',
          input: 'var(--input)',
          'input-background': 'var(--input-background)',
          'switch-background': 'var(--switch-background)',
          ring: 'var(--ring)',
          sidebar: 'var(--sidebar)',
          'sidebar-foreground': 'var(--sidebar-foreground)',
          'sidebar-primary': 'var(--sidebar-primary)',
          'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
        },
        borderRadius: {
          sm: 'calc(var(--radius) - 4px)',
          md: 'calc(var(--radius) - 2px)',
          lg: 'var(--radius)',
          xl: 'calc(var(--radius) + 4px)',
        },
        fontSize: {
          base: 'var(--font-size)',
        },
      },
    },
    plugins: [],
  };
  