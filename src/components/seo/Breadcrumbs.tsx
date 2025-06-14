
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    ...pathnames.map((name, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
      return { label, path };
    })
  ];

  // Generate structured data for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.label,
      "item": `https://generateai.dev${crumb.path}`
    }))
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <nav aria-label="Breadcrumb" className="py-4 px-6">
        <ol className="flex items-center space-x-2 text-sm text-light-gray">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-white font-medium" aria-current="page">
                  {index === 0 && <Home className="w-4 h-4 mr-1 inline" />}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-teal transition-colors flex items-center"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
