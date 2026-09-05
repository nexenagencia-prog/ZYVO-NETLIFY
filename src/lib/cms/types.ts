export type JsonMap = Record<string, unknown>;

export type CmsSection = {
  id?: string;
  page_id?: string;
  section_key: string;
  section_type?: string;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  content?: JsonMap;
  media?: JsonMap;
  sort_order?: number;
  is_visible?: boolean;
};

export type CmsPage = {
  id?: string;
  slug: string;
  name?: string;
  title?: string | null;
  settings?: JsonMap;
  is_published?: boolean;
  sections: CmsSection[];
};

export type CmsNavigationItem = {
  id?: string;
  nav_key: string;
  label: string;
  href: string;
  icon_key?: string | null;
  sort_order: number;
  is_visible: boolean;
  metadata?: JsonMap;
};

export type CmsProfile = {
  id?: string;
  display_name: string;
  role_label: string;
  plan_label?: string;
  avatar_url?: string;
  avatar_media_id?: string | null;
  metadata?: JsonMap;
};

export type CmsMedia = {
  id?: string;
  bucket: string;
  path: string;
  public_url?: string | null;
  alt_text?: string | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
  file_size?: number | null;
};

export type CmsBundle = {
  pages: Record<string, CmsPage>;
  navigation: CmsNavigationItem[];
  profile: CmsProfile;
  media: CmsMedia[];
};
