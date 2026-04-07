require('dotenv').config();
const supabase = require('./config/supabase');

(async () => {
  const { data, error } = await supabase.from('posts').select('*');

  if (error) {
    console.log('ERROR:', error);
  } else {
    console.log('DATA:', data);
  }
})();