"use client";
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getFiles } from '@/lib/actions/file.action';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { useDebounce } from 'use-debounce';
const Search = () => {
  const [query,setQuery] = useState('')
  const [results,setResults] = useState<Models.Document[]>([])
  const [open,setOpen] = useState(false)
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);
  useEffect(()=>{
    const fetchFiles = async () =>{
      if(debouncedQuery.length === 0){
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({types : [], searchText:debouncedQuery});
      setResults(files.documents);
      setOpen(true);
    }
  },[debouncedQuery])
  useEffect(()=>{
    if(!searchQuery){
      setQuery("");
    }
  },[])

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  };

  return (
    <div className='search'>
      <div className='search-input-wrapper'>
        <Image src='/assets/icons/search.svg' alt='Search' width={24} height={24}>
        </Image>
        <Input value={query} placeholder='Search...' className='seach-input' onChange={(e)=>{setQuery(e.target.value)}}/>
        {
          open && (
            <ul className='search-result'>
              {
                results.length > 0 ? (
                  results.map((result)=>(
                    <li onClick={() => handleClickItem(result)} className='flex items-center justify-between' key={result.$id}>
                      <div className='flex cursor-pointer items-center gap-4'>
                        <Thumbnail type={result.type} extension={result.extension} url={result.url} className='size-9 min-w-9'></Thumbnail>
                        <p className='text-light-100 line-clamp-1 subtitle-2'>{result.name}</p>
                      </div>
                      <FormattedDateTime date={result.$createdAt} className='caption line-clamp-1 text-light-200'></FormattedDateTime>
                    </li>
                  ))
                ) : <p className='empty-result'>No Files Found</p>
              }
            </ul>
          )
        }
      </div>
    </div>
  )
}

export default Search