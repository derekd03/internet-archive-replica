-- Table: public.files

-- DROP TABLE IF EXISTS public.files;

CREATE TABLE IF NOT EXISTS public.files
(
    id uuid NOT NULL,
    filename text COLLATE pg_catalog."default" NOT NULL,
    filepath text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    subjects text[] COLLATE pg_catalog."default",
    creator text COLLATE pg_catalog."default",
    upload_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    collection text COLLATE pg_catalog."default" NOT NULL,
    language text COLLATE pg_catalog."default",
    license text COLLATE pg_catalog."default",
    file_size bigint, -- Add file_size column to store file size in bytes
    CONSTRAINT files_pkey PRIMARY KEY (id),
    CONSTRAINT files_license_check CHECK (license = ANY (ARRAY[''::text, 'CC0'::text, 'CC'::text, 'PD'::text])),
    CONSTRAINT files_collection_check CHECK (collection = ANY (ARRAY['community_texts'::text, 'community_movies'::text, 'community_audio'::text, 'community_software'::text, 'community_image'::text, 'community_data'::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.files
    OWNER to postgres;

-- Index: idx_files_collection

-- DROP INDEX IF EXISTS public.idx_files_collection;

CREATE INDEX IF NOT EXISTS idx_files_collection
    ON public.files USING btree
    (collection COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: idx_files_title

-- DROP INDEX IF EXISTS public.idx_files_title;

CREATE INDEX IF NOT EXISTS idx_files_title
    ON public.files USING btree
    (title COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;