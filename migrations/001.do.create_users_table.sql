create extension if not exists "uuid-ossp";

create table users (
    
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),    
    username text not null,
    password text not null,
    email text not null,
    first_name text not null
);

 