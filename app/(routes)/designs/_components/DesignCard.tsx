import Image from 'next/image';
import Link from 'next/link'; 
import React from 'react';
import { RECORD } from '@/app/view-code/[uid]/page';
import { Button } from '@/components/ui/button';
import { Code2 } from 'lucide-react';

interface Props {
  sketch: RECORD;
}

const DesignCard = ({ sketch }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg">
      <Image
        src={sketch.imageURL}
        alt="Sketch Image"
        width={400}
        height={300}
        className="w-full max-h-[300px] bg-gray-100 object-contain p-2"
      />

 
      <div className="flex items-center justify-between px-4 py-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold capitalize">{sketch.description}</h2>
          <p className="text-sm text-gray-500">
            <span className="text-gray-900 font-medium">Model Used:</span> {sketch.model}
          </p>
          <p className="text-sm text-gray-500">
            <span className="text-gray-900 font-medium">By:</span> {sketch.createdBy}
          </p>
        </div>

        <Link href={`/view-code/${sketch?.uid}`}>
          <Button
            className="transition-all duration-300 hover:bg-gray-700 hover:text-white hover:scale-105 flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            View code
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DesignCard;
