create table journal_data(
   id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),  
    date_created TIMESTAMPTZ default now() not null,
    day_rating integer not null ,
    deep_hours numeric not null ,
    journal_entry text not null,
    user_id uuid references users(id) on delete cascade
);
set TIMEZONE = 'America/New_York';