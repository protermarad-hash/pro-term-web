-- Adaugă serviciile de montaj standard ca produse în tabela products
-- Rulați în Supabase SQL Editor: https://supabase.com/dashboard/project/dydzfhyndsdbrhrwvgib/sql

INSERT INTO products (slug, name, brand, category, btu, capacity_label, price, energy_class, description, features, specs, stock_status, active)
VALUES
(
  'montaj-standard-9000-12000-btu',
  'Montaj Standard 9.000–12.000 BTU',
  'PRO TERM',
  'Servicii montaj',
  12000,
  '9.000–12.000 BTU',
  750,
  NULL,
  'Montaj standard aer condiționat 9.000–12.000 BTU executat de echipa certificată PRO TERM SRL Arad. Include traseu frigorific 3 m, o singură străpungere, console, cablu electric și probă de funcționare. Garanție instalare 12 luni.',
  '["Traseu frigorific 3 m (țeavă cupru + izolație)","Cablu electric 5x1.5 sau 5x2 – 3,5 m","Tub evacuare condens Ø16/18 – 2 m","Console 2 buc","O singură străpungere perete exterior","Bandajare traseu frigorific","Probă funcționare + explicare facilități","Garanție instalare 12 luni"]'::jsonb,
  '{"durata_garantie":"12 luni","btu_min":9000,"btu_max":12000,"traseu_inclus":"3 m","strapungeri_incluse":1,"zona":"Arad și județ"}'::jsonb,
  'in-stock',
  true
),
(
  'montaj-standard-18000-btu',
  'Montaj Standard 18.000 BTU',
  'PRO TERM',
  'Servicii montaj',
  18000,
  '18.000 BTU',
  850,
  NULL,
  'Montaj standard aer condiționat 18.000 BTU executat de echipa certificată PRO TERM SRL Arad. Include traseu frigorific 3 m, o singură străpungere, console, cablu electric și probă de funcționare. Garanție instalare 12 luni.',
  '["Traseu frigorific 3 m (țeavă cupru + izolație)","Cablu electric 5x1.5 sau 5x2 – 3,5 m","Tub evacuare condens Ø16/18 – 2 m","Console 2 buc","O singură străpungere perete exterior","Bandajare traseu frigorific","Probă funcționare + explicare facilități","Garanție instalare 12 luni"]'::jsonb,
  '{"durata_garantie":"12 luni","btu_min":18000,"btu_max":18000,"traseu_inclus":"3 m","strapungeri_incluse":1,"zona":"Arad și județ"}'::jsonb,
  'in-stock',
  true
),
(
  'montaj-standard-24000-btu',
  'Montaj Standard 24.000 BTU',
  'PRO TERM',
  'Servicii montaj',
  24000,
  '24.000 BTU',
  1150,
  NULL,
  'Montaj standard aer condiționat 24.000 BTU executat de echipa certificată PRO TERM SRL Arad. Include traseu frigorific 3 m, o singură străpungere, console, cablu electric și probă de funcționare. Garanție instalare 12 luni.',
  '["Traseu frigorific 3 m (țeavă cupru + izolație)","Cablu electric 5x1.5 sau 5x2 – 3,5 m","Tub evacuare condens Ø16/18 – 2 m","Console 2 buc","O singură străpungere perete exterior","Bandajare traseu frigorific","Probă funcționare + explicare facilități","Garanție instalare 12 luni"]'::jsonb,
  '{"durata_garantie":"12 luni","btu_min":24000,"btu_max":24000,"traseu_inclus":"3 m","strapungeri_incluse":1,"zona":"Arad și județ"}'::jsonb,
  'in-stock',
  true
)
ON CONFLICT (slug) DO NOTHING;
