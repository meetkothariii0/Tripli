'use client';

import { ExternalLink } from 'lucide-react';

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  author?: string;
  date?: string;
}

export default function BlogCard({
  title,
  description,
  image,
  link,
  author,
  date,
}: BlogCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden h-48 bg-gray-200">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
        </div>

        {/* Content Container */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 flex-1">
            {description}
          </p>

          {(author || date) && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              {author && <span>{author}</span>}
              {date && <span>{date}</span>}
            </div>
          )}

          {/* Read More Link */}
          <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all duration-300">
            <span>Read More</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </a>
  );
}
