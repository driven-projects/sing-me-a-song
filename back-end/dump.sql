--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Ubuntu 14.5-1.pgdg22.04+1)
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations (
    id integer NOT NULL,
    name text NOT NULL,
    "youtubeLink" text NOT NULL,
    score integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.recommendations OWNER TO postgres;

--
-- Name: recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommendations_id_seq OWNER TO postgres;

--
-- Name: recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendations_id_seq OWNED BY public.recommendations.id;


--
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN id SET DEFAULT nextval('public.recommendations_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
19e9f0ef-752d-41e0-9a31-53a30a061674	71a2549faad5f74f2336bf75e5f172b2178bf57488b1e5cb64a4712411419bb5	2022-09-20 16:48:34.24-03	20220503164046_create_recommendations	\N	\N	2022-09-20 16:48:33.915442-03	1
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations (id, name, "youtubeLink", score) FROM stdin;
823	Rudolph	https://www.youtube.com/watch?v=h_D3VFfhvs4	66
824	Born in the USA	https://www.youtube.com/watch?v=h_D3VFfhvs4	84
825	Green Onions	https://www.youtube.com/watch?v=h_D3VFfhvs4	83
826	I Got You Babe	https://www.youtube.com/watch?v=h_D3VFfhvs4	63
827	Believe	https://www.youtube.com/watch?v=h_D3VFfhvs4	76
828	Funkytown	https://www.youtube.com/watch?v=h_D3VFfhvs4	19
829	Another Night	https://www.youtube.com/watch?v=h_D3VFfhvs4	63
830	Earth Angel	https://www.youtube.com/watch?v=h_D3VFfhvs4	46
831	All Out of Love	https://www.youtube.com/watch?v=h_D3VFfhvs4	21
832	Gonna Make You Sweat (Everybody Dance Now)	https://www.youtube.com/watch?v=h_D3VFfhvs4	30
833	Le Freak	https://www.youtube.com/watch?v=h_D3VFfhvs4	35
834	Stronger	https://www.youtube.com/watch?v=h_D3VFfhvs4	3
835	I Got You (I Feel Good)	https://www.youtube.com/watch?v=h_D3VFfhvs4	94
836	Crazy Little Thing Called Love	https://www.youtube.com/watch?v=h_D3VFfhvs4	77
837	Papa Don't Preach	https://www.youtube.com/watch?v=h_D3VFfhvs4	43
\.


--
-- Name: recommendations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recommendations_id_seq', 837, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- Name: recommendations_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX recommendations_name_key ON public.recommendations USING btree (name);


--
-- PostgreSQL database dump complete
--

