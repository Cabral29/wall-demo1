"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'
import { database } from '@/lib/database'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Upload, X, Send } from 'lucide-react'
import Image from 'next/image'

interface PhotoUploadProps {
  onPhotoUploaded: () => void
}

export function PhotoUpload({ onPhotoUploaded }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Create preview
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    setSelectedFile(file)
    setError("")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!selectedFile) {
      setError("Please select a photo first")
      return
    }
    
    if (isSubmitting) return

    console.log('Submitting photo post:', { caption: caption.trim() })
    
    setIsSubmitting(true)

    try {
      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `wall-photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('wall-photos')
        .upload(filePath, selectedFile)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('wall-photos')
        .getPublicUrl(filePath)

      // Save photo post to database
      const success = await database.addPhotoPost(caption.trim() || "Shared a photo", publicUrl)

      if (success) {
        setCaption("")
        setPreview(null)
        setSelectedFile(null)
        if (preview) {
          URL.revokeObjectURL(preview)
        }
        onPhotoUploaded()
      } else {
        setError("Failed to post photo. Please try again.")
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      setError('Error uploading photo. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  })

  const clearPreview = () => {
    setPreview(null)
    setSelectedFile(null)
    setCaption("")
    setError("")
    if (preview) {
      URL.revokeObjectURL(preview)
    }
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div>
            <p className="text-gray-600 mb-2">
              {isDragActive 
                ? 'Drop the photo here...' 
                : 'Drag & drop a photo here, or click to select'
              }
            </p>
            <Button variant="outline" size="sm">
              Select Photo
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Image
                  src={preview}
                  alt="Preview"
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={clearPreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption to your photo..."
                  className="w-full min-h-[80px] p-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  maxLength={280}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-zinc-500">
                    {caption.length}/280 characters
                  </span>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      "Sharing..."
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Share Photo
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 