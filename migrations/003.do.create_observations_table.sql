create table observations(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),  
    user_id uuid references users(id) on delete cascade not null,
    date_created timestamp default now() not null,
    observation text not null
);
