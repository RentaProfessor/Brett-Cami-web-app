import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('🌱 Starting database seed...')

  try {
    // 1. Upsert reunion date (7 days from now)
    const reunionDate = new Date()
    reunionDate.setDate(reunionDate.getDate() + 7)
    
    const { error: settingsError } = await supabase
      .from('app_settings')
      .upsert({ 
        id: '1',
        reunion_at: reunionDate.toISOString()
      })

    if (settingsError) {
      console.error('Error seeding app_settings:', settingsError)
    } else {
      console.log('✅ Seeded app_settings with reunion date:', reunionDate.toISOString())
    }

    // 2. Create sample profiles (these would normally be created by auth triggers)
    const profiles = [
      {
        id: 'brett-profile-id',
        email: 'brett@example.com',
        name: 'Brett'
      },
      {
        id: 'cami-profile-id', 
        email: 'cami@example.com',
        name: 'Cami'
      }
    ]

    for (const profile of profiles) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profile)

      if (profileError) {
        console.error(`Error seeding profile ${profile.email}:`, profileError)
      } else {
        console.log(`✅ Seeded profile: ${profile.email}`)
      }
    }

    // 3. Create a sample letter from Brett to Cami
    const { error: letterError } = await supabase
      .from('letters')
      .insert({
        sender_id: 'brett-profile-id',
        recipient_id: 'cami-profile-id',
        subject: 'Missing you already 💕',
        content: 'Hey beautiful! I hope you\'re having an amazing day. I can\'t stop thinking about our last video call and how much I miss your smile. Counting down the days until we can be together again. Love you so much! ❤️'
      })

    if (letterError) {
      console.error('Error seeding letter:', letterError)
    } else {
      console.log('✅ Seeded sample letter from Brett to Cami')
    }

    // 4. Create a sample shared event (next week)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(19, 0, 0, 0) // 7 PM

    const eventEnd = new Date(nextWeek)
    eventEnd.setHours(20, 0, 0, 0) // 8 PM

    const { error: eventError } = await supabase
      .from('events')
      .insert({
        owner_id: 'brett-profile-id',
        title: 'Weekly Date Night',
        description: 'Our special weekly video date night! Can\'t wait to see your beautiful face.',
        start_time: nextWeek.toISOString(),
        end_time: eventEnd.toISOString(),
        is_shared: true
      })

    if (eventError) {
      console.error('Error seeding event:', eventError)
    } else {
      console.log('✅ Seeded sample shared event for next week')
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📝 Summary:')
    console.log('- Set reunion date to 7 days from now')
    console.log('- Created profiles for Brett and Cami')
    console.log('- Added a romantic letter from Brett to Cami')
    console.log('- Created a shared date night event for next week')
    console.log('\n💡 Note: In production, profiles are created automatically when users sign up.')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

// Run the seed function
seed()

