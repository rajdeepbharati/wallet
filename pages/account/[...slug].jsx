import { useRouter } from 'next/router'
// import Header from '../../components/header'

const Account = () => {
  const router = useRouter()
  const slug = router.query.slug || []

  return (
    <>
      <h1>Slug: {slug.join('/')}</h1>
      <h2>{slug}</h2>
    </>
  )
}

export default Account
