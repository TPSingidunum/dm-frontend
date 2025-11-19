export interface Product {
  product_id: number
  slug: string
  name: string
  img_url: string
  description: string
  seo?: Seo
}

export interface Seo {
  title: string,
  description: string,
  key_words: string[]
}